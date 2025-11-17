ALTER TABLE "chats" DROP CONSTRAINT "chats_subscription_id_chat_subscription_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN "subscription_id";