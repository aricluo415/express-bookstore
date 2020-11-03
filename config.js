/** Common config for bookstore. */

const DB_URI = process.env.NODE_ENV === "test"
  ? `postgresql:///bookstore_test`
  : process.env.DATABASE_URL || `postgresql:///bookstore`;


module.exports = { DB_URI };