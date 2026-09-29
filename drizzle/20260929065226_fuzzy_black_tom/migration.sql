CREATE TYPE "status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "todos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"task" text NOT NULL,
	"status" "status" DEFAULT 'pending'::"status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
