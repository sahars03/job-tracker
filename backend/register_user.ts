import pool from "./db";
import bcrypt from "bcrypt";

export async function createUser(username: string, email: string, password: string) {
  if (!username || !email || !password) {
    throw new Error("Missing fields");
  }
  console.log("all fields here");
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed");
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3) RETURNING id`,
    [username, email, hashedPassword]
  );
  console.log("added");
  return { success: true, userId: result.rows[0].id };
}

/*
this is what was originally in route.ts:
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    console.log("found");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed");

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hashedPassword]
    );
    console.log("inserted");

    return NextResponse.json({ success: true, userId: result.rows[0].id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
*/