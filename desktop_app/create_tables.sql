--add auto gen id
CREATE SEQUENCE photos_id_seq;
  
CREATE TABLE photos
(id bigint NOT NULL DEFAULT nextval('photos_id_seq'::regclass),
geom geometry(MultiPoint,4326),
importId text,
path text,
photopath text,
datetaken timestamp without time zone,
temperature numeric,
session text,
siteid text,
itemstatus text,
specieswolv boolean DEFAULT false,
speciesother text,
numanimals numeric,
age numeric,
sex text,
behaviour text,
indivname text,
vischest boolean DEFAULT false,
vislactation boolean DEFAULT false,
vissex boolean DEFAULT false,
visbait boolean DEFAULT false,
removedbait boolean DEFAULT false,
daterembait timestamp without time zone,
checkcamera boolean DEFAULT false,
"createdAt" timestamp without time zone NOT NULL DEFAULT now(),
"updatedAt" timestamp without time zone NOT NULL DEFAULT now()
)

CREATE SEQUENCE imports_id_seq;
CREATE TABLE imports
(
    id bigint NOT NULL DEFAULT nextval('imports_id_seq'::regclass),
    importid text,
    lastVerified bigint,
	"createdAt" timestamp without time zone NOT NULL DEFAULT now(),
	"updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT imports_pkey PRIMARY KEY (id)
)
--add auto gen id
--  CREATE SEQUENCE imports_id_seq;
--  ALTER TABLE imports ALTER COLUMN id SET DEFAULT nextval('imports_id_seq');
--  UPDATE imports SET id = nextval('imports_id_seq');
