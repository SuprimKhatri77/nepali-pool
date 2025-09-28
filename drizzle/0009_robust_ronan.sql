-- 009: Safe enum and table creation

DO $$
BEGIN
    -- Payment enums
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE "payment_status" AS ENUM('pending','paid','failed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type') THEN
        CREATE TYPE "payment_type" AS ENUM('chat_subscription','video_call');
    END IF;

    -- Subscription enums
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE "subscription_status" AS ENUM('active','expired','cancelled');
    END IF;

    -- Video call enums
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_call_status') THEN
        CREATE TYPE "video_call_status" AS ENUM('pending','scheduled','completed','canceled');
    END IF;
END$$;

-- Chat subscription table
CREATE TABLE IF NOT EXISTS "chat_subscription" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "student_id" text NOT NULL,
    "mentor_id" text NOT NULL,
    "payment_id" text NOT NULL,
    "start_date" timestamp NOT NULL,
    "end_date" timestamp NOT NULL,
    "status" "subscription_status" DEFAULT 'active',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Payment table
CREATE TABLE IF NOT EXISTS "payment" (
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

-- School table
CREATE TABLE IF NOT EXISTS "school" (
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

-- Video call table
CREATE TABLE IF NOT EXISTS "video_call" (
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

-- Foreign keys
ALTER TABLE "chat_subscription" ADD CONSTRAINT IF NOT EXISTS "chat_subscription_student_id_student_profile_user_id_fk"
    FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "chat_subscription" ADD CONSTRAINT IF NOT EXISTS "chat_subscription_mentor_id_mentor_profile_user_id_fk"
    FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "chat_subscription" ADD CONSTRAINT IF NOT EXISTS "chat_subscription_payment_id_payment_id_fk"
    FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payment" ADD CONSTRAINT IF NOT EXISTS "payment_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "video_call" ADD CONSTRAINT IF NOT EXISTS "video_call_student_id_student_profile_user_id_fk"
    FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "video_call" ADD CONSTRAINT IF NOT EXISTS "video_call_mentor_id_mentor_profile_user_id_fk"
    FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "video_call" ADD CONSTRAINT IF NOT EXISTS "video_call_payment_id_payment_id_fk"
    FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;

-- Unique index
CREATE UNIQUE INDEX IF NOT EXISTS "unique_active_chat" ON "chat_subscription" USING btree ("student_id","mentor_id","status");

-- Optional: drop obsolete columns (make sure you want data loss)
-- ALTER TABLE "student_profile" DROP COLUMN IF EXISTS "payment_status";

