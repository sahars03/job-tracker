import { NextResponse } from "next/server";
import { createUser } from "@/backend/register_user";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    console.log(`username: ${username}, email: ${email}, password: ${password}`);
    const result = await createUser(username, email, password);
    console.log("user created...");
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}