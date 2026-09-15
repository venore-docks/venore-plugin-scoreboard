CREATE SCHEMA "scoreboard";
--> statement-breakpoint
CREATE TABLE "scoreboard"."board_editors" (
	"board_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "board_editors_board_id_user_id_pk" PRIMARY KEY("board_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "scoreboard"."boards" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sector" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoreboard"."prime_status_mapping" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"raw_status" text NOT NULL,
	"stage_key" text NOT NULL,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoreboard"."prime_student_raw" (
	"id" text PRIMARY KEY NOT NULL,
	"external_student_id" text NOT NULL,
	"raw_segment_or_course" text NOT NULL,
	"raw_enrollment_type" text NOT NULL,
	"raw_status" text NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"prime_sync_log_id" text,
	CONSTRAINT "scoreboard_prime_student_raw_enrollment_type_check" CHECK ("scoreboard"."prime_student_raw"."raw_enrollment_type" in ('new','reenrollment'))
);
--> statement-breakpoint
CREATE TABLE "scoreboard"."prime_sync_log" (
	"id" text PRIMARY KEY NOT NULL,
	"triggered_by_user_id" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"status" text DEFAULT 'running' NOT NULL,
	"students_fetched" integer,
	"students_upserted" integer,
	"boards_recomputed" jsonb,
	"error_message" text,
	CONSTRAINT "scoreboard_prime_sync_log_status_check" CHECK ("scoreboard"."prime_sync_log"."status" in ('running','success','failed'))
);
--> statement-breakpoint
CREATE TABLE "scoreboard"."widgets" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"data_source" text DEFAULT 'manual' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scoreboard_widgets_kind_check" CHECK ("scoreboard"."widgets"."kind" in ('goal_progress','funnel','metric_free')),
	CONSTRAINT "scoreboard_widgets_data_source_check" CHECK ("scoreboard"."widgets"."data_source" in ('manual','prime_sync'))
);
--> statement-breakpoint
ALTER TABLE "scoreboard"."board_editors" ADD CONSTRAINT "board_editors_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "scoreboard"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoreboard"."prime_status_mapping" ADD CONSTRAINT "prime_status_mapping_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "scoreboard"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoreboard"."prime_student_raw" ADD CONSTRAINT "prime_student_raw_prime_sync_log_id_prime_sync_log_id_fk" FOREIGN KEY ("prime_sync_log_id") REFERENCES "scoreboard"."prime_sync_log"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoreboard"."widgets" ADD CONSTRAINT "widgets_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "scoreboard"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "scoreboard_boards_slug_idx" ON "scoreboard"."boards" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "scoreboard_prime_status_mapping_board_raw_idx" ON "scoreboard"."prime_status_mapping" USING btree ("board_id","raw_status");--> statement-breakpoint
CREATE UNIQUE INDEX "scoreboard_prime_student_raw_external_id_idx" ON "scoreboard"."prime_student_raw" USING btree ("external_student_id");--> statement-breakpoint
CREATE INDEX "scoreboard_prime_student_raw_segment_idx" ON "scoreboard"."prime_student_raw" USING btree ("raw_segment_or_course");--> statement-breakpoint
CREATE INDEX "scoreboard_prime_sync_log_started_at_idx" ON "scoreboard"."prime_sync_log" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "scoreboard_widgets_board_order_idx" ON "scoreboard"."widgets" USING btree ("board_id","order");