const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Akwaaba Table API is healthy",
  })
})

module.exports = router