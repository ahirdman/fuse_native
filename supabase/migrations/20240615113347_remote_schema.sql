alter table "public"."accounts" add column "pushToken" text;

CREATE UNIQUE INDEX "accounts_pushToken_key" ON public.accounts USING btree ("pushToken");

alter table "public"."accounts" add constraint "accounts_pushToken_key" UNIQUE using index "accounts_pushToken_key";


