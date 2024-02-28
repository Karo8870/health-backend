CREATE TABLE IF NOT EXISTS "Comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text,
	"date" timestamp DEFAULT now(),
	"postID" integer,
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostReview" (
	"id" serial PRIMARY KEY NOT NULL,
	"like" boolean,
	"userID" integer,
	"postID" integer,
	CONSTRAINT "PostReview_userID_postID_unique" UNIQUE("userID","postID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text,
	"date" timestamp DEFAULT now(),
	"productEAN" varchar(15),
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Restriction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProductDetails" (
	"id" serial PRIMARY KEY NOT NULL,
	"ean" varchar(15),
	"data" jsonb,
	CONSTRAINT "ProductDetails_ean_unique" UNIQUE("ean")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProductReview" (
	"id" serial PRIMARY KEY NOT NULL,
	"like" boolean,
	"userID" integer,
	"productEAN" varchar(15),
	CONSTRAINT "ProductReview_userID_productEAN_unique" UNIQUE("userID","productEAN")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" jsonb,
	"status" varchar,
	"date" timestamp DEFAULT now(),
	"productEAN" varchar(15),
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(30),
	"lastName" varchar(30),
	"user" varchar(30),
	"password" varchar,
	"email" varchar,
	"admin" boolean DEFAULT false,
	CONSTRAINT "User_user_unique" UNIQUE("user"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postID_Post_id_fk" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorID_User_id_fk" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostReview" ADD CONSTRAINT "PostReview_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostReview" ADD CONSTRAINT "PostReview_postID_Post_id_fk" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_authorID_User_id_fk" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Restriction" ADD CONSTRAINT "Restriction_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Submission" ADD CONSTRAINT "Submission_authorID_User_id_fk" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
