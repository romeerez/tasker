


CREATE TABLE public."user" (
    id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);
CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

alter table "public"."user" rename column "first_name" to "firstName";

alter table "public"."user" rename column "last_name" to "lastName";

ALTER TABLE "public"."user" ADD COLUMN "username" text NOT NULL UNIQUE;

ALTER TABLE "public"."user" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();

ALTER TABLE "public"."user" ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_updated_at"
BEFORE UPDATE ON "public"."user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_updated_at" ON "public"."user" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."user" ALTER COLUMN "created_at" SET NOT NULL;

alter table "public"."user" rename column "created_at" to "createdAt";

alter table "public"."user" rename column "updated_at" to "updatedAt";

ALTER TABLE "public"."user" ADD COLUMN "confirmationSentAt" timestamptz NULL;

ALTER TABLE "public"."user" DROP COLUMN "updatedAt" CASCADE;

ALTER TABLE "public"."user" ADD COLUMN "updatedAt" timestamptz NULL DEFAULT now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_updatedAt"
BEFORE UPDATE ON "public"."user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_user_updatedAt" ON "public"."user" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

ALTER TABLE "public"."user" DROP COLUMN "updatedAt" CASCADE;

ALTER TABLE "public"."user" ADD COLUMN "updatedAt" timestamptz NULL DEFAULT now();

DROP TRIGGER "set_public_user_updated_at" ON "public"."user";

ALTER TABLE "public"."user" ADD COLUMN "confirmedAt" timestamptz NULL;

ALTER TABLE "public"."user" ADD COLUMN "resetPasswordSentAt" timestamptz NULL;
