import { NextResponse } from "next/server";

export async function POST() {
  // remove the user's JWT information to log them out
  const response = NextResponse.json({success: true});
  response.cookies.set("auth", "", {maxAge: 0});
  return response;
}