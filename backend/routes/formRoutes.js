import dotenv from "dotenv"


// THIS CODE WILL BE FOR ADDING AN APPLICATION TO A USER'S ACCOUNT



dotenv.config();

const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/form
router.post("/", async (req, res) => {
  try {
    // update this with the other fields
    const { name, email, message } = req.body;

    // update this with the other fields
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
