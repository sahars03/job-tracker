const dotenv = require("dotenv");
const pkg = require("pg");
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  host: "localhost",
  port: 5432,
  database: process.env.PG_DATABASE
});

module.exports = pool;