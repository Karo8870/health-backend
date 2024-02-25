CREATE TABLE IF NOT EXISTS "Product" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Restriction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(30),
	"lastName" varchar(30),
	"user" varchar(30),
	"password" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Restriction" ADD CONSTRAINT "Restriction_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
