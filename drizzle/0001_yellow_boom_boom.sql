CREATE TABLE IF NOT EXISTS "PostContent" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"postID" integer
);
--> statement-breakpoint
ALTER TABLE "Post" ADD COLUMN "title" varchar(100);--> statement-breakpoint
ALTER TABLE "Post" DROP COLUMN IF EXISTS "body";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostContent" ADD CONSTRAINT "PostContent_postID_Post_id_fk" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
