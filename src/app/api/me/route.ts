import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/backend/db";
import bcrypt from "bcrypt";

// GET for checking if the user is logged in
export async function GET() {

  // check the user who has logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return NextResponse.json({error: "Not authenticated" }, {status: 401});
  }

  // verify the user's details
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
    username: string;
  };

  // check if information about the user can be found
  const result = await pool.query(
    "SELECT email FROM users WHERE id = $1",
    [decoded.userId]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  // return the user's login status and information
  return NextResponse.json({
    loggedIn: true,
    userId: decoded.userId,
    username: decoded.username,
    email: result.rows[0].email,
  });
}

// PUT for updating the user's information
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
    console.log("USERNAME")
    if (username && username.trim() !== "") {
      values.push(username);
      updates.push(`username = $${values.length}`);
    }

    // email
      console.log("USERNAME")

    if (email && email.trim() !== "") {
      values.push(email);
      updates.push(`email = $${values.length}`);
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.push(hashedPassword);
      updates.push(`password_hash = $${values.length}`);
    }

    for (let i = 0; i < values.length; i++) {
      console.log(values[i]);
    }
    console.log("!");
    
    // nothing to update
    if (updates.length === 0) {
          console.log("No fields to update");

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

export async function DELETE(req: Request) {

    try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1",
      [decoded.userId]
    );

    console.log("deleted!");

    return NextResponse.json({status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
