const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const healthRoutes = require("./routes/healthRoutes")
const menuRoutes = require("./routes/menuRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
 
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Akwaaba Table API is running",
  })
})

app.use("/api/health", healthRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/reservations", reservationRoutes)
app.listen(PORT, () => {
  console.log(`Akwaaba Table API running on http://localhost:${PORT}`)
})