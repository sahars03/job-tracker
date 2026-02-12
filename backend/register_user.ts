import pool from "./db";
import bcrypt from "bcrypt";

export async function createUser(username: string, email: string, password: string) {
  // none of the fields can be empty
  if (!username || !email || !password) {
    throw new Error("Missing fields");
  }

  // create a password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // INSERT query to make a new user
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3) RETURNING id`,
    [username, email, hashedPassword]
  );

  return {status: true, userId: result.rows[0].id};
}