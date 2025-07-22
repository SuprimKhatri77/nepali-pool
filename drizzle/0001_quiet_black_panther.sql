CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "mentor_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"country" varchar(255),
	"city" varchar(255),
	"zip_code" varchar(255),
	"phone_number" varchar(100),
	"nationality" varchar(255),
	"sex" varchar(255),
	"resume" text,
	"citizenship_photo_url" text,
	"image_url" text,
	"verified_status" "status" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "student_profile" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "favorite_destination" text[];--> statement-breakpoint
ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" DROP COLUMN "role";