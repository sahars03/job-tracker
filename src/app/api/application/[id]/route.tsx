import { NextResponse } from "next/server";
import pool from "@/backend/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: number } }
) {
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
      `SELECT *
       FROM applications
       WHERE id = $1 AND user_id = $2`,
      [params.id, decoded.userId]
    );

    if (result.rows.length === 0) {
        console.log("oops");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log(result.rows[0]);
    const row = result.rows[0];

    return NextResponse.json({
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
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
