const { Client } = require("pg")


const db = new Client({
    connectionString: "postgresql://postgres:Iamaleg001@localhost:5432/biztime"
})

db.connect()

module.exports = db