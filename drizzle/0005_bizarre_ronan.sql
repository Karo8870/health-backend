ALTER TABLE "Product" ALTER COLUMN "ean" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "Review" ALTER COLUMN "value" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "Submission" ADD COLUMN "ean" varchar;