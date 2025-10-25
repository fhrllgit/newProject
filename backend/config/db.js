const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "backendLomba",
    port: 3307
})

db.connect(err => {
    if (err) throw err;
    console.log("Database connected!")
})

module.exports = db