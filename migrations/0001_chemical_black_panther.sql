CREATE TABLE "class" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"number" text NOT NULL,
	"semester" text NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_class" (
	"userId" text NOT NULL,
	"classId" text NOT NULL,
	"role" text NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_class" ADD CONSTRAINT "user_class_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_class" ADD CONSTRAINT "user_class_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;