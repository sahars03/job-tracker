import dotenv from "dotenv"

dotenv.config();

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const result = await pool.query(
      `INSERT INTO ${process.env.PG_DATABASE} (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error inserting form data:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

module.exports = router;
