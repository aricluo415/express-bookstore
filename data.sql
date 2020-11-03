CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amazon_url TEXT NOT NULL,
  author TEXT NOT NULL,
  language TEXT NOT NULL,
  pages INTEGER,
  publisher TEXT NOT NULL,
  year INTEGER);
