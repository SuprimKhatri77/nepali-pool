ALTER TABLE "chats" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "mentor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "subscription_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_subscription_id_chat_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."chat_subscription"("id") ON DELETE cascade ON UPDATE no action;