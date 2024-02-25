ALTER TABLE "product" RENAME TO "Product";--> statement-breakpoint
ALTER TABLE "restriction" RENAME TO "Restriction";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "User";--> statement-breakpoint
ALTER TABLE "Restriction" DROP CONSTRAINT "restriction_userID_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Restriction" ADD CONSTRAINT "Restriction_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
