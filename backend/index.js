const express = require("express")
const cors = require("cors")
const path = require("path")

const uploadRoutes = require("./routes/uploadRoutes")
const routeProduct = require("./routes/productRoutes")
const routeCategory = require("./routes/categoryRoutes")

const app = express()
const PORT = 3005

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/tmp", express.static(path.join(__dirname, "uploads/tmp"))); 


app.use("/api/uploads", uploadRoutes)
app.use("/api/products", routeProduct)
app.use("/api/category", routeCategory)

app.listen(PORT, () => {
  console.log(`Server running 🚀  on http://localhost:${PORT}`)
})

