import {
  InferInsertModel,
  InferSelectModel,
  One,
  relations,
} from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  pgEnum,
  uuid,
  uniqueIndex,
  bigint,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["none", "student", "mentor", "admin"]);

export const mentorVerifiedStatusEnum = pgEnum("mentor_verified_status", [
  "pending",
  "accepted",
  "rejected",
]);
export const sexEnum = pgEnum("sex", ["male", "female", "other"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: roleEnum("role").default("none"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  consumed: boolean("consumed").default(false),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const rateLimit = pgTable("rate_limit", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  key: text("key").notNull(),
  count: integer("count"),
  lastRequest: bigint("last_request", { mode: "number" }),
});

export const studentProfile = pgTable("student_profile", {
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  bio: text("bio"),
  district: varchar("district", { length: 30 }),
  phoneNumber: varchar("phone_number", { length: 30 }),
  sex: sexEnum("sex"),
  city: varchar("city", { length: 30 }),
  imageUrl: text("image_url").default(
    "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
  ),
  favoriteDestination: text("favorite_destination").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentTypeEnum = pgEnum("payment_type", [
  "chat_subscription",
  "video_call",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
]);

export const payment = pgTable("payment", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  type: paymentTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 20 }).default("USD"),
  status: paymentStatusEnum("status").default("pending"),
  stripePaymentId: text("stripe_payment_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
]);
export const chatSubscription = pgTable(
  "chat_subscription",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    studentId: text("student_id")
      .references(() => studentProfile.userId, { onDelete: "cascade" })
      .notNull(),
    mentorId: text("mentor_id")
      .references(() => mentorProfile.userId, { onDelete: "cascade" })
      .notNull(),
    paymentId: uuid("payment_id")
      .references(() => payment.id, { onDelete: "cascade" })
      .notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    status: subscriptionStatusEnum("status").default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_chat").on(table.studentId, table.mentorId),
    index("idx_sub_student").on(table.studentId),
    index("idx_sub_mentor").on(table.mentorId),
  ]
);

export const chatSubscriptionPayment = pgTable(
  "chat_subscription_payment",
  {
    subscriptionId: uuid("subscription_id")
      .references(() => chatSubscription.id, { onDelete: "cascade" })
      .notNull(),
    paymentId: uuid("payment_id")
      .references(() => payment.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.subscriptionId, table.paymentId] })]
);

export const videoCallStatusEnum = pgEnum("video_call_status", [
  "pending",
  "scheduled",
  "completed",
  "cancelled",
]);

export const videoCall = pgTable(
  "video_call",
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    studentId: text("student_id")
      .references(() => studentProfile.userId, { onDelete: "cascade" })
      .notNull(),
    mentorId: text("mentor_id")
      .references(() => mentorProfile.userId, { onDelete: "cascade" })
      .notNull(),
    scheduledTime: timestamp("scheduled_time"),
    paymentId: uuid("payment_id").references(() => payment.id, {
      onDelete: "cascade",
    }),
    startUrl: text("start_url"),
    joinUrl: text("join_url"),
    status: videoCallStatusEnum("status").default("pending"),
    zoomMeetingId: text("zoom_meeting_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_video_student").on(table.studentId),
    index("idx_video_mentor").on(table.mentorId),
    index("idx_video_scheduledTime").on(table.scheduledTime),
  ]
);

export const preferredTimeStatusEnum = pgEnum("preferred_time_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const preferredTime = pgTable(
  "preferred_time",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    videoId: uuid("video_id").references(() => videoCall.id, {
      onDelete: "cascade",
    }),
    studentPreferredTime: timestamp("student_preferred_time", {
      withTimezone: true,
    }),
    mentorPreferredTime: timestamp("mentor_preferred_time", {
      withTimezone: true,
    }),
    status: preferredTimeStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("unique_video_id").on(table.videoId)]
);

export const suggestedByEnum = pgEnum("suggestedBy", ["student", "mentor"]);

export const preferredTimeLog = pgTable("preferred_time_log", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  videoId: uuid("video_id").references(() => videoCall.id),
  suggestedBy: suggestedByEnum("suggested_by").notNull(),
  suggestedTime: timestamp("suggested_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mentorProfile = pgTable("mentor_profile", {
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  bio: text("bio"),
  country: varchar("country", { length: 255 }),
  city: varchar("city", { length: 255 }),
  zipCode: varchar("zip_code", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 100 }),
  nationality: varchar("nationality", { length: 255 }),
  sex: sexEnum("sex"),
  resume: text("resume"),
  citizenshipPhotoUrl: text("citizenship_photo_url"),
  imageUrl: text("image_url").default(
    "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
  ),
  verifiedStatus:
    mentorVerifiedStatusEnum("verified_status").default("pending"),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const favorite = pgTable(
  "favorite",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    studentId: text("student_id").references(() => studentProfile.userId, {
      onDelete: "cascade",
    }),
    mentorId: text("mentor_id").references(() => mentorProfile.userId, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_student_mentor").on(table.studentId, table.mentorId),
  ]
);

export const school = pgTable("school", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  address: text("address"),
  city: text("city"),
  prefecture: text("prefecture"),
  websiteUrl: text("website_url"),
  email: text("email"),
  imageUrl: text("image_url"),
  supportInternationalStudents: boolean(
    "support_international_students"
  ).default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatStatusEnum = pgEnum("chat_status", ["active", "expired"]);

export const chats = pgTable(
  "chats",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    subscriptionId: uuid("subscription_id")
      .references(() => chatSubscription.id, { onDelete: "cascade" })
      .notNull(),
    studentId: text("student_id")
      .references(() => studentProfile.userId, {
        onDelete: "cascade",
      })
      .notNull(),
    mentorId: text("mentor_id")
      .references(() => mentorProfile.userId, {
        onDelete: "cascade",
      })
      .notNull(),
    status: chatStatusEnum("status").default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_student_mentor_chat").on(
      table.studentId,
      table.mentorId
    ),
    index("idx_chats_student").on(table.studentId),
    index("idx_chats_mentor").on(table.mentorId),
    index("idx_chats_lastMessage").on(table.lastMessageAt),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    senderId: text("sender_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    chatId: uuid("chat_id").references(() => chats.id, { onDelete: "cascade" }),
    message: text("message"),
    isEdited: boolean("is_edited").default(false),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("index_chat_id_created_at").on(table.chatId, table.createdAt),
  ]
);

export const messageAttachments = pgTable("message_attachments", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  messageId: uuid("message_id").references(() => messages.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  type: text("type"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==========RELATIONS===============

export const messageAttachmentRelations = relations(
  messageAttachments,
  ({ one }) => ({
    messages: one(messages, {
      fields: [messageAttachments.messageId],
      references: [messages.id],
    }),
  })
);

export const chatRelations = relations(chats, ({ one }) => ({
  mentorProfile: one(mentorProfile, {
    fields: [chats.mentorId],
    references: [mentorProfile.userId],
  }),
  studentProfile: one(studentProfile, {
    fields: [chats.studentId],
    references: [studentProfile.userId],
  }),
  chatSubscription: one(chatSubscription, {
    fields: [chats.subscriptionId],
    references: [chatSubscription.id],
  }),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  chats: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  user: one(user, {
    fields: [messages.senderId],
    references: [user.id],
  }),
  messageAttachments: many(messageAttachments),
}));

export const userRelations = relations(user, ({ one }) => ({
  studentProfile: one(studentProfile, {
    fields: [user.id],
    references: [studentProfile.userId],
  }),
  mentorProfile: one(mentorProfile, {
    fields: [user.id],
    references: [mentorProfile.userId],
  }),
}));

export const studentRelations = relations(studentProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [studentProfile.userId],
    references: [user.id],
  }),
  chats: many(chats),
  videoCall: many(videoCall),
}));

export const mentorRelations = relations(mentorProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [mentorProfile.userId],
    references: [user.id],
  }),
  chats: many(chats),
}));

export const favoriteRelations = relations(favorite, ({ one }) => ({
  mentor: one(mentorProfile, {
    fields: [favorite.mentorId],
    references: [mentorProfile.userId],
  }),
  student: one(studentProfile, {
    fields: [favorite.studentId],
    references: [studentProfile.userId],
  }),
}));

export const videoCallRelations = relations(videoCall, ({ one, many }) => ({
  studentProfile: one(studentProfile, {
    fields: [videoCall.studentId],
    references: [studentProfile.userId],
  }),
  mentorProfile: one(mentorProfile, {
    fields: [videoCall.mentorId],
    references: [mentorProfile.userId],
  }),
  preferredTime: one(preferredTime, {
    fields: [videoCall.id],
    references: [preferredTime.videoId],
  }),
  preferredTimeLog: many(preferredTimeLog),
}));

export const preferredTimeRelations = relations(preferredTime, ({ one }) => ({
  videoCall: one(videoCall, {
    fields: [preferredTime.videoId],
    references: [videoCall.id],
  }),
}));

export const preferredTimeLogRelations = relations(
  preferredTimeLog,
  ({ one }) => ({
    videoCall: one(videoCall, {
      fields: [preferredTimeLog.videoId],
      references: [videoCall.id],
    }),
  })
);

export type StudentProfileSelectType = InferSelectModel<typeof studentProfile>;
export type StudentProfileInsertType = InferInsertModel<typeof studentProfile>;
export type MentorProfileSelectType = InferSelectModel<typeof mentorProfile>;
export type MentorProfileInsertType = InferInsertModel<typeof mentorProfile>;
export type UserSelectType = InferSelectModel<typeof user>;
export type UserInsertType = InferInsertModel<typeof user>;
export type FavoriteSelectType = InferSelectModel<typeof favorite>;
export type FavoriteInsertType = InferInsertModel<typeof favorite>;
export type SchoolInsertType = InferInsertModel<typeof school>;
export type SchoolSelectType = InferSelectModel<typeof school>;
export type ChatSubscriptionSelectType = InferSelectModel<
  typeof chatSubscription
>;
export type VideoCallSelectType = InferSelectModel<typeof videoCall>;
export type PreferredTimeSelectType = InferSelectModel<typeof preferredTime>;
export type ChatsSelectType = InferSelectModel<typeof chats>;
export type ChatsInsertType = InferInsertModel<typeof chats>;
export type MessageSelectType = InferSelectModel<typeof messages>;
export type MessageInsertType = InferInsertModel<typeof messages>;
export type MessageAttachmentsSelectType = InferSelectModel<
  typeof messageAttachments
>;
export type MessageAttachmentsInsertType = InferInsertModel<
  typeof messageAttachments
>;
