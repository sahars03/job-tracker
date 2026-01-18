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
      jobTitle: row.job_title || "",
      company: row.company || "",
      location: row.job_location || "",
      jobType: row.job_type || "",
      workSetting: row.work_setting || [] as string[],
      dateApplied: row.date_applied || "",
      status: row.app_status || "",
      stageReached: row.stage_reached || "",
      notes: row.notes || "",
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const applicationId = Number(params.id);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

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

    const result = await pool.query(
      `
      UPDATE applications
      SET
        job_title = $1,
        company = $2,
        job_location = $3,
        job_type = $4,
        work_setting = $5,
        date_applied = $6,
        app_status = $7,
        stage_reached = $8,
        notes = $9
      WHERE id = $10 AND user_id = $11
      RETURNING id
      `,
      [
        jobTitle,
        company,
        location,
        jobType,
        workSetting,
        dateApplied,
        status,
        stageReached,
        notes,
        applicationId,
        decoded.userId,
      ]
    );

    if (result.rowCount === 0) {
        return NextResponse.json(
            { error: "Application not found or unauthorised" },
            { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
