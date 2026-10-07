const express = require("express")
const pool = require("../db")

const router = express.Router()
router.patch("/test", (req, res) => {
  console.log("PATCH TEST ROUTE WORKS")

  res.json({
    status: "success",
    message: "PATCH route is working",
  })
})

router.post("/", async (req, res) => {
  const { date, time, guests, requests } = req.body

  try {
    const result = await pool.query(
      `
      INSERT INTO reservations
      (reservation_date, reservation_time, guests, requests)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [date, time, guests, requests || null]
    )

    res.status(201).json({
      status: "success",
      message: "Reservation created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating reservation:", error.message)

    res.status(500).json({
      status: "error",
      message: "Failed to create reservation",
    })
  }
})

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reservations ORDER BY created_at DESC"
    )

    res.json({
      status: "success",
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching reservations:", error.message)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch reservations",
    })
  }
})

router.patch("/:id/status", async (req, res) => {
    console.log("PATCH STATUS ROUTE HIT")
console.log("ID:", req.params.id)
console.log("STATUS:", req.body.status)
  const { id } = req.params
  const { status } = req.body

  const allowedStatuses = ["pending", "confirmed", "cancelled"]

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid reservation status",
    })
  }

  try {
    const result = await pool.query(
      `
      UPDATE reservations
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Reservation not found",
      })
    }

    res.json({
      status: "success",
      message: "Reservation status updated",
      data: result.rows[0],
    })
  } catch (error) {
    console.error(
      "Error updating reservation status:",
      error.message,
    )

    res.status(500).json({
      status: "error",
      message: "Failed to update reservation status",
    })
  }
})

module.exports = router