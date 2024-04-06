CREATE TABLE IF NOT EXISTS "Badge" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30)
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
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DailyIntake" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" integer,
	"date" date,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Redeem" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"description" text,
	"points" integer DEFAULT 0
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
	"challengeID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserToTeam" (
	"userID" integer,
	"teamID" integer,
	CONSTRAINT "UserToTeam_userID_teamID_pk" PRIMARY KEY("userID","teamID")
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "points" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "dailyLog" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "dailyChallenge" boolean DEFAULT false;--> statement-breakpoint
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
