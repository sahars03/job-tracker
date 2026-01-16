import { NextResponse } from "next/server";
import pool from "@/backend/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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

    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
        console.log("NOTHING");
        return NextResponse.json(
        {
            message: "Nothing found",
            applications: [],
        },
        { status: 200 }
        );
    }

    const apps = result.rows.map(row => ({
      id: row.id,
      jobTitle: row.job_title,
      company: row.company,
      location: row.job_location,
      jobType: row.job_type,
      workSetting: row.work_setting,
      dateApplied: row.date_applied,
      status: row.app_status,
      stageReached: row.stage_reached,
      notes: row.notes,
    }));

    return NextResponse.json(
    {
        message: "Found applications",
        applications: apps,
    },
    { status: 200 }
    );

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
