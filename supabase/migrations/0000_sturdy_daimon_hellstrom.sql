CREATE TYPE "public"."mentor_verified_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('chat_subscription', 'video_call');--> statement-breakpoint
CREATE TYPE "public"."preferred_time_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('none', 'student', 'mentor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."suggestedBy" AS ENUM('student', 'mentor');--> statement-breakpoint
CREATE TYPE "public"."video_call_status" AS ENUM('pending', 'scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"mentor_id" text NOT NULL,
	"payment_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "subscription_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text,
	"mentor_id" text,
	"status" "chat_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"lastMessageAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "favorite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text,
	"mentor_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentor_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"bio" text,
	"country" varchar(255),
	"city" varchar(255),
	"zip_code" varchar(255),
	"phone_number" varchar(100),
	"nationality" varchar(255),
	"sex" "sex",
	"resume" text,
	"citizenship_photo_url" text,
	"image_url" text DEFAULT 'https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE',
	"verified_status" "mentor_verified_status" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" text,
	"chat_id" uuid,
	"message" text,
	"is_edited" boolean DEFAULT false,
	"attachment_url" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "payment_type" NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(20) DEFAULT 'USD',
	"status" "payment_status" DEFAULT 'pending',
	"stripe_payment_id" text,
	"stripe_subscription_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "preferred_time" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid,
	"student_preferred_time" timestamp with time zone,
	"mentor_preferred_time" timestamp with time zone,
	"status" "preferred_time_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "preferred_time_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid,
	"suggested_by" "suggestedBy" NOT NULL,
	"suggested_time" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"last_request" bigint
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"address" text,
	"city" text,
	"prefecture" text,
	"website_url" text,
	"email" text,
	"image_url" text,
	"support_international_students" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "student_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"bio" text,
	"district" varchar(30),
	"phone_number" varchar(30),
	"sex" "sex",
	"city" varchar(30),
	"image_url" text DEFAULT 'https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE',
	"favorite_destination" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "role" DEFAULT 'none',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "video_call" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"mentor_id" text NOT NULL,
	"scheduled_time" timestamp,
	"payment_id" uuid,
	"start_url" text,
	"join_url" text,
	"status" "video_call_status" DEFAULT 'pending',
	"zoom_meeting_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preferred_time" ADD CONSTRAINT "preferred_time_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preferred_time_log" ADD CONSTRAINT "preferred_time_log_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_chat" ON "chat_subscription" USING btree ("student_id","mentor_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_mentor" ON "favorite" USING btree ("student_id","mentor_id");--> statement-breakpoint
CREATE INDEX "index_chat_id_created_at" ON "messages" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_video_id" ON "preferred_time" USING btree ("video_id");