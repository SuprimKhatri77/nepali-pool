ALTER TABLE "rate_limit" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rate_limit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "rate_limit" ALTER COLUMN "key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "consumed" boolean DEFAULT false;