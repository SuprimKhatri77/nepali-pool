CREATE TYPE "public"."service_booking_status" AS ENUM('pending', 'confirmed', 'rejected', 'cancelled', 'completed');--> statement-breakpoint
CREATE TABLE "mentor_payment_details" (
	"mentor_id" text PRIMARY KEY NOT NULL,
	"instructions" text,
	"qr_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mentor_payment_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "mentor_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" text NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"price_npr" integer NOT NULL,
	"duration_minutes" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_service_price_positive" CHECK ("mentor_service"."price_npr" > 0),
	CONSTRAINT "mentor_service_duration_positive" CHECK ("mentor_service"."duration_minutes" IS NULL OR "mentor_service"."duration_minutes" > 0)
);
--> statement-breakpoint
ALTER TABLE "mentor_service" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "service_booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_code" varchar(20) NOT NULL,
	"service_id" uuid,
	"mentor_id" text NOT NULL,
	"student_id" text NOT NULL,
	"service_title" varchar(120) NOT NULL,
	"price_npr" integer NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"whatsapp_number" varchar(30) NOT NULL,
	"message" text,
	"payment_proof_url" text NOT NULL,
	"payment_reference" varchar(100),
	"status" "service_booking_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"verified_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_booking_reference_code_unique" UNIQUE("reference_code")
);
--> statement-breakpoint
ALTER TABLE "service_booking" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "mentor_payment_details" ADD CONSTRAINT "mentor_payment_details_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_service" ADD CONSTRAINT "mentor_service_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_booking" ADD CONSTRAINT "service_booking_service_id_mentor_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."mentor_service"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_booking" ADD CONSTRAINT "service_booking_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_booking" ADD CONSTRAINT "service_booking_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mentor_service_mentor" ON "mentor_service" USING btree ("mentor_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_service_booking_mentor_status" ON "service_booking" USING btree ("mentor_id","status");--> statement-breakpoint
CREATE INDEX "idx_service_booking_student" ON "service_booking" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_pending_booking_per_service" ON "service_booking" USING btree ("student_id","service_id") WHERE "service_booking"."status" = 'pending';