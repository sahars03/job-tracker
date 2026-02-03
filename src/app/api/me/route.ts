import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/backend/db";
import bcrypt from "bcrypt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value; 

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      username: string;
    };

    return NextResponse.json({
      loggedIn: true,
      userId: decoded.userId,
      username: decoded.username,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}


export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const { username, email, password } = await req.json();

    const updates: string[] = [];
    const values: any[] = [];

    // username
    if (username && username.trim() !== "") {
      values.push(username);
      updates.push(`username = $${values.length}`);
    }

    // email
    if (email && email.trim() !== "") {
      values.push(email);
      updates.push(`email = $${values.length}`);
    }

    // password
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.push(hashedPassword);
      updates.push(`password = $${values.length}`);
    }

    // nothing to update
    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // WHERE clause
    values.push(decoded.userId);

    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING username, email
    `;

    const result = await pool.query(query, values);

    return NextResponse.json({ user: result.rows[0] }, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
