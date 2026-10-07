const express = require("express")
const pool = require("../db")

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items ORDER BY id ASC"
    )

    res.json({
      status: "success",
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching menu:", error.message)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch menu items",
    })
  }
})

module.exports = router