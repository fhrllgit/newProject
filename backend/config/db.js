const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "",
    database: "ecommerce",
    port: 3306
})

db.connect(err => {
    if (err) throw err;
    console.log("Database connected!")
})

module.exports = db