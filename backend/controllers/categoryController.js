const db = require("../config/db")
const response = require("../response")

exports.getCategory = (req, res) => {
    const sql = `SELECT * FROM categories`
    db.query(sql, (err, result) => {
        if (err) {
            return response(500, err, "Failed to get categories", res)
        }
        response(200, result, "Success", res)
    })
}