
alter table "public"."user" rename column "updatedAt" to "updated_at";

alter table "public"."user" rename column "createdAt" to "created_at";


ALTER TABLE "public"."user" ALTER COLUMN "created_at" DROP NOT NULL;

DROP TRIGGER IF EXISTS "set_public_user_updated_at" ON "public"."user";
ALTER TABLE "public"."user" DROP COLUMN "updated_at";

ALTER TABLE "public"."user" DROP COLUMN "created_at";

ALTER TABLE "public"."user" DROP COLUMN "username";

alter table "public"."user" rename column "lastName" to "last_name";

alter table "public"."user" rename column "firstName" to "first_name";

DROP TABLE public."user" CASCADE;