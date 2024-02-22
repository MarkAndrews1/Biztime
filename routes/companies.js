const express = require("express")
const slugify = require('slugify')
const db = require("../db")
const ExpressError = require("../expressError")

const router = express.Router()

router.get("/", async function(req, res, next){
    try{
        const result = await db.query(
            `SELECT code, name FROM companies ORDER BY name`
        )
        return res.json({"companies": result.rows})
    }
    catch (e){
        return next(e)
    }
})

router.post("/", async function(req, res, next){
    try{
        let {name, description} = req.body
        let code = slugify(name, {lower: true})

        const result = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,[code, name, description]
        )

        return res.status(201).json({"company": result.rows[0]})

    }catch(err){
        return next(err)
    }
})

router.get("/:code", async function(req, res, next){
    try{
        let code = req.params.code

        const compRes = await db.query(
            `SELECT * FROM companies where code=$1`,[code]
        )

        if(compRes.rows.length === 0){
            throw new ExpressError(`Can not find company with a code of ${code}.`, 404)
        }

        const comp = compRes.rows[0]

        return res.json({"company": comp})
        

    }catch(err){
        return next(err)
    }
})

router.put("/:code", async function(req, res, next){
    try{
        let code = req.params.code
        let { name, description } = req.body
        
        const result = await db.query(
            `UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code, name, description`, [code, name, description]
        )

        if(result.rows.length === 0){
            throw new ExpressError(`No company with the code ${code}.`, 404)
        }

        return res.json({"company": result.rows[0]})

    }catch(err){
        return next(err)
    }
})

router.delete("/:code", async function(req, res, next){
    try{
        let code = req.params.code
        
        const result = await db.query(
            `DELETE FROM companies WHERE code=$1 RETURNING code`, [code]
        )

        if(result.rows.length === 0){
            throw new ExpressError(`No company with the code ${code}.`, 404)
        }

        return res.json({"status": "Deleted company"})

    }catch(err){
        return next(err)
    }
})

module.exports = router;