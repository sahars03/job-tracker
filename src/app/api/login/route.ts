import { NextResponse } from "next/server";
import pool from "@/backend/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // username/email and password provided by the user
    const {un_email, password} = await req.json();

    // SEARCH query to find the user, if they exist
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1 OR email = $1",
      [un_email]
    );
    
    // if nothing is returned, the user does not exist
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // user details
    const user = result.rows[0];

    // compare the passwords by using the given password (hashed) and the stored password hash
    // if they do not match, an incorrect password has been given
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        {error: "Invalid credentials"},
        {status: 401}
      );
    }

    // create a JSON web token that contains the
    // - payload (i.e. user ID and username information)
    // - cryptographic signature key
    // - expiration date for the token (i.e. in 7 days)
    const token = jwt.sign(
      {userId: user.id, username: user.username},
      process.env.JWT_SECRET!,
      {expiresIn: "7d"}
    );

    // success response
    const response = NextResponse.json(
      {message: "Login successful"},
      {status: 200}
    );

    // attach the JWT as a cookie
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
