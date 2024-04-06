CREATE TABLE IF NOT EXISTS "Badge" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30),
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "BadgeToUser" (
	"badgeID" integer NOT NULL,
	"userID" integer NOT NULL,
	CONSTRAINT "BadgeToUser_badgeID_userID_pk" PRIMARY KEY("badgeID","userID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CommunityChallenge" (
	"id" serial PRIMARY KEY NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"title" varchar(100),
	"description" text,
	"goal" integer,
	"unit" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text,
	"date" timestamp DEFAULT now(),
	"postID" integer,
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DailyIntake" (
	"userID" integer,
	"date" date,
	"data" jsonb,
	CONSTRAINT "DailyIntake_date_userID_pk" PRIMARY KEY("date","userID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PostContent" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"postID" integer
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
	"title" varchar(100),
	"date" timestamp DEFAULT now(),
	"productEAN" varchar(15),
	"authorID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Restriction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"data" jsonb,
	"personal" jsonb,
	"goals" jsonb
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
CREATE TABLE IF NOT EXISTS "Redeem" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"description" text,
	"points" integer DEFAULT 0
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
CREATE TABLE IF NOT EXISTS "TeamInvite" (
	"teamID" integer,
	"userID" integer,
	CONSTRAINT "TeamInvite_userID_teamID_pk" PRIMARY KEY("userID","teamID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"challengeID" integer,
	"creatorID" integer
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
	"points" integer DEFAULT 0,
	"dailyChallenge" timestamp DEFAULT TO_TIMESTAMP(0),
	"premium" timestamp DEFAULT TO_TIMESTAMP(0),
	CONSTRAINT "User_user_unique" UNIQUE("user"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserToTeam" (
	"userID" integer,
	"teamID" integer,
	CONSTRAINT "UserToTeam_userID_teamID_pk" PRIMARY KEY("userID","teamID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BadgeToUser" ADD CONSTRAINT "BadgeToUser_badgeID_Badge_id_fk" FOREIGN KEY ("badgeID") REFERENCES "Badge"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BadgeToUser" ADD CONSTRAINT "BadgeToUser_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "PostContent" ADD CONSTRAINT "PostContent_postID_Post_id_fk" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE cascade;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_teamID_Teams_id_fk" FOREIGN KEY ("teamID") REFERENCES "Teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Teams" ADD CONSTRAINT "Teams_challengeID_CommunityChallenge_id_fk" FOREIGN KEY ("challengeID") REFERENCES "CommunityChallenge"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Teams" ADD CONSTRAINT "Teams_creatorID_User_id_fk" FOREIGN KEY ("creatorID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserToTeam" ADD CONSTRAINT "UserToTeam_userID_User_id_fk" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserToTeam" ADD CONSTRAINT "UserToTeam_teamID_Teams_id_fk" FOREIGN KEY ("teamID") REFERENCES "Teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
