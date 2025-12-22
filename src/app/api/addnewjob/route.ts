import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/backend/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const {
      jobTitle,
      company,
      location,
      jobType,
      workSetting,
      dateApplied,
      status,
      stageReached,
      notes,
    } = await req.json();

    await pool.query(
      `
      INSERT INTO applications (
        user_id,
        job_title,
        company,
        job_location,
        job_type,
        work_setting,
        date_applied,
        app_status,
        stage_reached,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
      [
        decoded.userId,
        jobTitle,
        company,
        location,
        jobType,
        workSetting,
        dateApplied,
        status || null,
        stageReached || null,
        notes || null,
      ]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Add job error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
