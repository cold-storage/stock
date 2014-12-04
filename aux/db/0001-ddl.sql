DROP TABLE IF EXISTS stock;

-- Tip: There is no performance difference among these three types
-- varchar, char and text, apart from
-- increased storage space when using the blank-padded type, and a few extra
-- CPU cycles to check the length when storing into a length-constrained
-- column. While character(n) has performance advantages in some other
-- database systems, there is no such advantage in PostgreSQL; in fact
-- character(n) is usually the slowest of the three because of its additional
-- storage costs. In most situations text or character varying should be used
-- instead.
--
-- http://www.postgresql.org/docs/9.1/static/datatype-character.html

CREATE TABLE stock (
  symbol text not null,
  company text not null default '',
  notes text not null default '',
  CONSTRAINT stock_pkey PRIMARY KEY (symbol)
);

CREATE TABLE stock_price (
  symbol text not null,
  day date not null,
  open numeric not null,
  high numeric not null,
  low numeric not null,
  close numeric not null,
  volume integer not null,
  CONSTRAINT stock_price_pkey PRIMARY KEY (symbol, day),
  CONSTRAINT stock_price_stock_fkey FOREIGN KEY (symbol)
      REFERENCES stock (symbol)
);
