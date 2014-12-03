

DROP DATABASE IF EXISTS {{ stock.db }};

DROP ROLE IF EXISTS {{ stock.role }};

CREATE ROLE {{ stock.role }} LOGIN
  PASSWORD '{{ stock.pw }}'
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

CREATE DATABASE {{ stock.db }}
  WITH OWNER = {{ stock.role }}
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;


