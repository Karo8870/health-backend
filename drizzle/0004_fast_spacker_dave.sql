CREATE TABLE IF NOT EXISTS "ProductDetails" (
	"id" serial PRIMARY KEY NOT NULL,
	"productID" integer,
	"details" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Review" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text,
	"value" integer,
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" jsonb,
	"authorID" integer,
	"status" varchar
);
--> statement-breakpoint
ALTER TABLE "Product" RENAME COLUMN "code" TO "ean";--> statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "upVotes" integer;--> statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "downVotes" integer;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "admin" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_productID_Product_id_fk" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
