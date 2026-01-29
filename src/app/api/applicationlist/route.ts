import { NextResponse } from "next/server";
import pool from "@/backend/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
    userId: number;
  };

  const filters = await req.json();

  let query = `
    SELECT *
    FROM applications
    WHERE user_id = $1
  `;

  const values: any[] = [decoded.userId];
  let i = 2;

  if (filters.jobTitle) {
    query += ` AND job_title ILIKE $${i++}`;
    values.push(`%${filters.jobTitle}%`);
  }

  if (filters.company) {
    query += ` AND company ILIKE $${i++}`;
    values.push(`%${filters.company}%`);
  }

  if (filters.location) {
    query += ` AND job_location ILIKE $${i++}`;
    values.push(`%${filters.location}%`);
  }

  if (filters.jobType?.fulltime) {
    query += ` AND job_type = "fulltime"`;
  }

  if (filters.jobType?.parttime) {
    query += ` AND job_type = "parttime"`;
  }

  const selectedWorkSettings: string[] = [];

  if (filters.workSetting?.inperson) selectedWorkSettings.push("inperson");
  if (filters.workSetting?.hybrid) selectedWorkSettings.push("hybrid");
  if (filters.workSetting?.remote) selectedWorkSettings.push("remote");

  if (selectedWorkSettings.length > 0) {
    query += ` AND work_setting && $${i++}::varchar[]`;
    values.push(selectedWorkSettings);
  }

  if (filters.dateFrom) {
    query += ` AND date_applied >= $${i++}`;
    values.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    query += ` AND date_applied <= $${i++}`;
    values.push(filters.dateTo);
  }

  if (filters.status) {
    query += ` AND app_status ILIKE $${i++}`;
    values.push(`%${filters.status}%`);
  }

  if (filters.stagereached) {
    query += ` AND stage_reached ILIKE $${i++}`;
    values.push(`%${filters.stagereached}%`);
  }

  const result = await pool.query(query, values);

    const apps = result.rows.map(row => ({
      id: row.id,
      jobTitle: row.job_title,
      company: row.company,
      location: row.job_location,
      jobType: row.job_type,
      workSetting: row.work_setting ?? [],
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
}

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
      workSetting: row.work_setting ?? [],
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
