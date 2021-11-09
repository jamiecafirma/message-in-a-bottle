set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."bottles" (
	"bottleId" serial NOT NULL,
	"messageTitle" TEXT NOT NULL,
	"senderName" TEXT NOT NULL,
	"recipientName" TEXT NOT NULL,
	"recipientEmail" TEXT NOT NULL,
	"mementos" json NOT NULL,
	CONSTRAINT "bottles_pk" PRIMARY KEY ("bottleId")
) WITH (
  OIDS=FALSE
);
