ALTER TABLE "User" ADD COLUMN "email" varchar;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_user_unique" UNIQUE("user");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");