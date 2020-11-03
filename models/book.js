"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");


/** Specialized error class for book not found. */

class BookNotFoundError extends NotFoundError {
  constructor(isbn) {
    super(`Book not found: ${isbn}`);
  }
}


/** Collection of related methods for books. */

class Book {
  /** given an isbn, return book data with that isbn:
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   **/

  static async getOne(isbn) {
    const results = await db.query(
          `SELECT isbn,
                  amazon_url,
                  author,
                  language,
                  pages,
                  publisher,
                  title,
                  year
             FROM books
             WHERE isbn = $1`, [isbn]);
    const book = results.rows[0];

    if (!book) throw new BookNotFoundError(isbn);
    return book;
  }

  /** Return array of book data:
   *
   * => [ {isbn, amazon_url, author, language,
   *       pages, publisher, title, year}, ... ]
   *
   * */

  static async getAll() {
    const results = await db.query(
          `SELECT isbn,
                  title,
                  author,
                  language,
                  pages,
                  publisher,
                  amazon_url,
                  year
             FROM books
             ORDER BY title`);

    return results.rows;
  }

  /** create book in database from data, return book data:
   *
   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async create(data) {
    const results = await db.query(`
          INSERT INTO books (isbn,
                             title,
                             author,
                             language,
                             pages,
                             publisher,
                             amazon_url,
                             year)
            VALUES
              ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING (isbn,
                       title,
                       author,
                       language,
                       pages,
                       publisher,
                       amazon_url,
                       year)`,
        [
          data.isbn,
          data.title,
          data.author,
          data.language,
          data.pages,
          data.publisher,
          data.amazon_url,
          data.year,
        ],
    );
    const books = results.rows[0];

    return books;
  }

  /** Update data with matching ID to data, return updated book.

   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async update(isbn, data) {
    const results = await db.query(
          `UPDATE books
           SET title=$1,
               author=$2,
               language=$3,
               pages=$4,
               publisher=$5,
               amazon_url=$6,
               year=$7
             WHERE isbn = $8
             RETURNING (isbn,
                        title,
                        author,
                        language,
                        pages,
                        publisher,
                        amazon_url,
                        year)`,
        [
          data.title,
          data.author,
          data.language,
          data.pages,
          data.publisher,
          data.amazon_url,
          data.year,
          isbn,
        ],
    );
    const book = results.rows[0];

    if (!book) throw new BookNotFoundError(isbn);
    return book;
  }

  /** remove book with matching isbn. Returns undefined. */

  static async remove(isbn) {
    const results = await db.query(
          `DELETE
             FROM books
             WHERE isbn = $1
             RETURNING isbn`,
        [isbn]);
    const book = results.rows[0];

    if (!book) throw new BookNotFoundError(isbn);
    return book;
  }
}


module.exports = Book;
