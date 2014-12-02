

DROP DATABASE IF EXISTS stock;

DROP ROLE IF EXISTS stock;

CREATE ROLE stock LOGIN
  ENCRYPTED PASSWORD 'md525377621dc5bb3b7c47fdd88056240d3'
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

CREATE DATABASE stock
  WITH OWNER = stock
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;


