CREATE TABLE "currencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(3) NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"base_currency_id" integer,
	"target_currency_id" integer,
	"rate" numeric(18, 6) NOT NULL,
	"effective_date" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rates" ADD CONSTRAINT "rates_base_currency_id_currencies_id_fk" FOREIGN KEY ("base_currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rates" ADD CONSTRAINT "rates_target_currency_id_currencies_id_fk" FOREIGN KEY ("target_currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;