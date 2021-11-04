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
	"playlistId" TEXT NOT NULL,
	CONSTRAINT "bottles_pk" PRIMARY KEY ("bottleId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."mementos" (
	"mementoId" serial NOT NULL,
	"bottleId" serial NOT NULL,
	"content" json NOT NULL,
	"slideIndex" integer NOT NULL,
	CONSTRAINT "mementos_pk" PRIMARY KEY ("mementoId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "mementos" ADD CONSTRAINT "mementos_fk0" FOREIGN KEY ("bottleId") REFERENCES "bottles"("bottleId");
