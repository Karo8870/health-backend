ALTER TABLE "Product" RENAME TO "product";--> statement-breakpoint
ALTER TABLE "Restriction" RENAME TO "restriction";--> statement-breakpoint
ALTER TABLE "User" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "Restriction_userID_User_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restriction" ADD CONSTRAINT "restriction_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
