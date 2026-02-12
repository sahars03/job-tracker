import { NextResponse } from "next/server";
import { createUser } from "@/backend/register_user";

export async function POST(req: Request) {
  try {
    // user details
    const { username, email, password } = await req.json();
    const result = await createUser(username, email, password);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}