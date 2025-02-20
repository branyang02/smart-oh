ALTER TYPE "public"."roles" RENAME TO "role";--> statement-breakpoint
ALTER TABLE "user_class" RENAME COLUMN "roles" TO "role";