import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["none", "student", "mentor", "admin"]);
export const paymentEnum = pgEnum("payment", ["unpaid", "paid"]);
export const statusEnum = pgEnum("status", ["pending", "accepted", "rejected"]);

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
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const studentProfile = pgTable("student_profile", {
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  bio: text("bio"),
  paymentStatus: paymentEnum("payment_status").default("unpaid"),
  imageUrl: text("image_url").default(
    "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
  ),
  favoriteDestination: text("favorite_destination").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  sex: varchar("sex", { length: 255 }),
  resume: text("resume"),
  citizenshipPhotoUrl: text("citizenship_photo_url"),
  imageUrl: text("image_url").default(
    "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
  ),
  verifiedStatus: statusEnum("verified_status").default("pending"),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const userStudentProfileRelation = relations(user, ({ one }) => ({
  studentProfile: one(studentProfile, {
    fields: [user.id],
    references: [studentProfile.userId],
  }),
}));

export const studentProfileUserRelation = relations(
  studentProfile,
  ({ one }) => ({
    user: one(user, {
      fields: [studentProfile.userId],
      references: [user.id],
    }),
  })
);

export const userMentorProfileRelation = relations(user, ({ one }) => ({
  mentorProfile: one(mentorProfile, {
    fields: [user.id],
    references: [mentorProfile.userId],
  }),
}));

export const mentorProfileUserRelation = relations(
  mentorProfile,
  ({ one }) => ({
    user: one(user, {
      fields: [mentorProfile.userId],
      references: [user.id],
    }),
  })
);

export type StudentProfileSelectType = InferSelectModel<typeof studentProfile>;
export type StudentProfileInsertType = InferInsertModel<typeof studentProfile>;
export type MentorProfileSelectType = InferSelectModel<typeof mentorProfile>;
export type MentorProfileInsertType = InferInsertModel<typeof mentorProfile>;
export type UserSelectType = InferSelectModel<typeof user>;
export type UserInsertType = InferInsertModel<typeof user>;
