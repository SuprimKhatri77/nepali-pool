CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('chat_subscription', 'video_call');--> statement-breakpoint
CREATE TYPE "public"."subscriptio_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."video_call_status" AS ENUM('pending', 'scheduled', 'completed', 'canceled');--> statement-breakpoint
CREATE TABLE "chat_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"mentor_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "subscriptio_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
CREATE TABLE "video_call" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"mentor_id" text NOT NULL,
	"scheduled_time" timestamp,
	"payment_id" text,
	"start_url" text,
	"join_url" text,
	"status" "video_call_status" DEFAULT 'pending',
	"zoom_meeting_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "scholl" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription" ADD CONSTRAINT "chat_subscription_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_call" ADD CONSTRAINT "video_call_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_chat" ON "chat_subscription" USING btree ("student_id","mentor_id","status");--> statement-breakpoint
ALTER TABLE "student_profile" DROP COLUMN "payment_status";--> statement-breakpoint
DROP TYPE "public"."payment";