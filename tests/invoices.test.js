
const app = require('../app')
const db = require('../db')
const request = require('supertest')
const { createData } = require('./create-test-data')

beforeEach(createData)

afterAll(async () => {
    await db.end()
})

describe("GET /", function () {
    test("It should return a array of all the invoices", async function () {
        const res = await request(app).get('/invoices')
        expect(res.body).toEqual({
            "invoices": [
                {
                    "id": 1,
                    "comp_code": "apple"
                },
                {
                    "id": 2,
                    "comp_code": "apple"
                },
                {
                    "id": 3,
                    "comp_code": "apple"
                },
                {
                    "id": 4,
                    "comp_code": "ibm"
                }
            ]
        })
    })
})

describe("GET /1", function () {
    test("It should return a info about the invoice", async function () {
        const res = await request(app).get('/invoices/1')
        expect(res.body).toEqual({
            "invoice": {
                "id": 1,
                "amt": 100,
                "paid": false,
                "add_date": "2024-02-22T05:00:00.000Z",
                "paid_date": null,
                "company": {
                    "code": "apple",
                    "name": "Apple Computer",
                    "description": "Maker of OSX."
                }
            }
        })
    })

    test("It should return 404 if no invoice", async function () {
        const res = await request(app).get("/invoices/9999999");
        expect(res.body).toEqual({
            "error": {
                "message": "Can not find company with a id of 9999999.",
                "status": 404
            },
            "message": "Can not find company with a id of 9999999."
        })

        expect(res.status).toEqual(404);
    })
})

describe("POST /", function () {
    test("It should create a invoice", async function () {
        const res = await request(app).post('/invoices').send({ amt: 400, comp_code: 'ibm' })
        expect(res.body).toEqual({
            "invoice": {
                "id": 5,
                "comp_code": "ibm",
                "amt": 400,
                "paid": false,
                "add_date": expect.any(String),
                "paid_date": null
            }
        })
    })
})

describe("PUT /", function () {
    test("It should edit a invoice", async function () {
        const res = await request(app).put('/invoices/1').send({ amt: 1100, paid: true })
        expect(res.body).toEqual({
            "invoice": {
                "id": 1,
                "comp_code": "apple",
                "amt": 1100,
                "paid": true,
                "add_date": expect.any(String),
                "paid_date": expect.any(String)
            }
        })
    })
})

describe("DELETE /", function(){
    test("It should delete a invoices", async function(){
        const res = await request(app).delete('/invoices/1')
        expect(res.body).toEqual({"status": "Deleted"})
    })
})