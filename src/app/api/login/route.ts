import { NextResponse } from "next/server";
import pool from "@/backend/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { un_email, password } = await req.json();

    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE (username = $1 OR email = $1) ",
      [un_email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {error: "Username/email not found"},
        {status: 404}
      );
    }

    const user = result.rows[0];

    // compare passwords
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // login successful — return the user ID
    return NextResponse.json(
      { message: "Login successful", userId: user.id },
      { status: 200 }
    );

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
