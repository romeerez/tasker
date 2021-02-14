
ALTER TABLE "public"."user" DROP COLUMN "resetPasswordSentAt";

ALTER TABLE "public"."user" DROP COLUMN "confirmedAt";

CREATE TRIGGER "set_public_user_updated_at"
BEFORE UPDATE ON "public"."user"
FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();COMMENT ON TRIGGER "set_public_user_updated_at" ON "public"."user"
IS E'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."user" DROP COLUMN "updatedAt";

ALTER TABLE "public"."user" ADD COLUMN "updatedAt" timestamptz;
ALTER TABLE "public"."user" ALTER COLUMN "updatedAt" DROP NOT NULL;
ALTER TABLE "public"."user" ALTER COLUMN "updatedAt" SET DEFAULT now();

DROP TRIGGER IF EXISTS "set_public_user_updatedAt" ON "public"."user";
ALTER TABLE "public"."user" DROP COLUMN "updatedAt";

ALTER TABLE "public"."user" ADD COLUMN "updatedAt" timestamptz;
ALTER TABLE "public"."user" ALTER COLUMN "updatedAt" DROP NOT NULL;
ALTER TABLE "public"."user" ALTER COLUMN "updatedAt" SET DEFAULT now();

ALTER TABLE "public"."user" DROP COLUMN "confirmationSentAt";


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