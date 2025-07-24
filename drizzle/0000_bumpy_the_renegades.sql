CREATE TYPE "public"."payment" AS ENUM('unpaid', 'paid');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('none', 'student', 'mentor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
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
CREATE TABLE "mentor_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"country" varchar(255),
	"city" varchar(255),
	"zip_code" varchar(255),
	"phone_number" varchar(100),
	"nationality" varchar(255),
	"sex" varchar(255),
	"resume" text,
	"citizenship_photo_url" text,
	"image_url" text DEFAULT 'https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE',
	"verified_status" "status" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
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
	"payment_status" "payment" DEFAULT 'unpaid',
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
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;