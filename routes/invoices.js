const express = require("express")
const db = require("../db")
const ExpressError = require("../expressError")

const router = express.Router()

router.get("/", async function(req, res, next){
    try{
        const result = await db.query(
            `SELECT id, comp_code
            FROM invoices
            ORDER BY id`
        )
        return res.json({"invoices": result.rows})
    }
    catch (e){
        return next(e)
    }
})

router.get("/:id", async function(req, res, next){
    try{
        let id = req.params.id

        const invoiceRes = await db.query(
            `SELECT * FROM invoices where id=$1`,[id]
        )

        if(invoiceRes.rows.length === 0){
            throw new ExpressError(`Can not find company with a id of ${id}.`, 404)
        }

        const data = invoiceRes.rows[0]

        let comp = await db.query(
            `SELECT * FROM companies where code=$1`,[data.comp_code]
        )

        const invoice = {
            id: data.id,
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
            company: comp.rows[0],
          };

        return res.json({"invoice": invoice})

    }catch(err){
        return next(err)
    }
})

router.post('/', async function(req, res, next){
    try{
        let {comp_code, amt} = req.body

        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,[comp_code, amt]
        )

        return res.json({"invoice": result.rows[0]})

    }catch(err){
        return next(err)
    }
})

router.put('/:id', async function(req, res, next){
    try{
        let {amt, paid} = req.body
        let id = req.params.id
        let paidDate = null

        const currResult = await db.query(
            `SELECT paid FROM invoices WHERE id = $1`,[id]
        )

        const date = currResult.rows[0].paid_date

        console.log(date)

        if(currResult.rows.length === 0){
            throw new ExpressError(`Can not find company with a id of ${id}.`, 404)
        }

        if(!date && paid){
            paidDate = new Date()
        } else if(!paid){
            paidDate = null
        }else{
            paidDate = date
        }

        const result = await db.query(
            `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING *`, [amt, paid, paidDate, id]
        )

        return res.json({"invoice": result.rows[0]})

    }catch(err){
        return next(err)
    }
})

router.delete("/:id", async function(req, res, next){
    try{
        let id = req.params.id

        const result = await db.query(
            `DELETE FROM invoices WHERE id=$1 RETURNING id`,[id]
        )

        if(result.rows.length === 0){
            throw new ExpressError(`Can not find company with a code of ${code}.`, 404)
        }

        return res.json({"status": "Deleted"})
    }catch(err){
        return next(err)
    }
})

module.exports = router;