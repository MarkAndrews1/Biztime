
const app = require('../app')
const db = require('../db')
const request = require('supertest')
const { createData } = require('./create-test-data')

beforeEach(createData)

afterAll(async () => {
    await db.end()
})

describe("GET /", function (){
    test("It should return a array of all the companies", async function(){
        const res = await request(app).get('/companies')
        expect(res.body).toEqual({
                "companies": [
                    {
                        "code": "apple",
                        "name": "Apple Computer"
                    },
                    {
                        "code": "ibm",
                        "name": "IBM"
                    },
                ]
            })
    })
})

describe("GET /apple", function(){
    test("It should return a company's info", async function(){
        const res = await request(app).get('/companies/apple')
        expect(res.body).toEqual({
            "company": {
                "code": "apple",
                "name": "Apple Computer",
                "description": "Maker of OSX."
            }
        })
    })

    test("It should return 404 if that company doesn't exist", async function(){
        const res = await request(app).get('/companies/fakeCompany1322')
        expect(res.body).toEqual({
            "error": {
                "message": "Can not find company with a code of fakeCompany1322.",
                "status": 404
            },
            "message": "Can not find company with a code of fakeCompany1322."
        })
        expect(res.status).toEqual(404)
    })
})

describe("POST /", function(){
    test("It should make company", async function(){
        const res = await request(app).post('/companies/').send({name: "FakeCompany", description: "This is a fake company for testing."})

        expect(res.body).toEqual({
            "company": {
                "code": "fakecompany",
                "name": "FakeCompany",
                "description": "This is a fake company for testing."
            }
        })
        expect(res.status).toEqual(201)
    })
})

describe("PUT /", function(){
    test("It should edit company", async function(){
        const res = await request(app).put('/companies/apple').send({name: "FakeApple", description: "This is a fake apple for testing."})

        expect(res.body).toEqual({
            "company": {
                "code": "apple",
                "name": "FakeApple",
                "description": "This is a fake apple for testing."
            }
        })
    })
})

describe("DELETE /", function(){
    test("It should delete company", async function(){
        const res = await request(app).delete('/companies/apple')

        expect(res.body).toEqual({"status": "Deleted company"})
    })
})