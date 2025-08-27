CREATE TABLE "scholl" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"address" text,
	"city" text,
	"perfecture" text,
	"website" text,
	"email" text,
	"image_url" text,
	"support_international_students" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
