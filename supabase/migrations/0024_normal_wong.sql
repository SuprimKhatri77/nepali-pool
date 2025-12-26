ALTER TABLE "connect_students" DROP CONSTRAINT "unqiue_user";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user" ON "connect_students" USING btree ("user_id");