const app = require("../app.js");
const request = require("supertest");
const db = require("../db.js");

describe("Integeration Test of /books", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books");

    });

    test("post/get/put a new book", async function() {
        const response = await request(app)
            .post("/books")
            .send({
                "title": "How to Code",
                "author": "Coder",
                "isbn": "123456789",
                "amazon_url": "https://amazon.com",
                "publisher": "Coding Books",
                "language": "English"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            "book": {
                "row": "(123456789,\"How to Code\",Coder,English,,\"Coding Books\",https://amazon.com,)"
            }
        });

        const getBookResp = await request(app).get(`/books/123456789`)
        expect(getBookResp.statusCode).toBe(200);
        expect(getBookResp.body).toEqual({
            "book": {
                "title": "How to Code",
                "author": "Coder",
                "isbn": "123456789",
                "amazon_url": "https://amazon.com",
                "publisher": "Coding Books",
                "language": "English",
                "year": null,
                "pages": null
            }
        });
        const updateBookResp = await request(app)
            .put(`/books/123456789`)
            .send({
                "title": "How to Code Better",
                "author": "Better Coder",
                "isbn": "123456789",
                "amazon_url": "https://amazon.com",
                "publisher": "Coding Books",
                "language": "French",
                "year": 2020,
                "pages": 100
            });
        expect(updateBookResp.statusCode).toBe(200);
        expect(updateBookResp.body).toEqual({
            book: {
                row: '(123456789,"How to Code Better","Better Coder",French,100,"Coding Books",https://amazon.com,2020)'
            }
        });
    });
});