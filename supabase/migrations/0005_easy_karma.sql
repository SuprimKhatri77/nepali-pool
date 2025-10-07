CREATE TABLE "chat_subscription_payment" (
	"subscription_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "chat_subscription_payment_subscription_id_payment_id_pk" PRIMARY KEY("subscription_id","payment_id")
);
--> statement-breakpoint
DROP INDEX "unique_active_chat";--> statement-breakpoint
ALTER TABLE "chat_subscription_payment" ADD CONSTRAINT "chat_subscription_payment_subscription_id_chat_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."chat_subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_subscription_payment" ADD CONSTRAINT "chat_subscription_payment_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_chat" ON "chat_subscription" USING btree ("student_id","mentor_id");