import { NextResponse } from "next/server";
import pool from "@/backend/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// GET for retrieving the contents of a specific job application
export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    // check the user who has logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({error: "Not authenticated" }, {status: 401});
    }

    // get the ID of the job being viewed
    const {id} = await params;
    const applicationId = Number(id);

    // check if the ID is a number
    if (isNaN(applicationId)) {
      return NextResponse.json({error: "Invalid ID" }, {status: 400});
    }

    // verify the user's details
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    // SELECT query to return the job information
    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE id = $1 AND user_id = $2`,
      [applicationId, decoded.userId]
    );

    // if nothing has been returned from the query, the job does not exist
    if (result.rows.length === 0) {
      return NextResponse.json({error: "Not found"}, {status: 404});
    }

    // job information
    const row = result.rows[0];

    // return the information
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
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}

// PUT for editing the contents of a job application
export async function PUT(
  req: Request,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    // check the user who has logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({error: "Not authenticated" }, {status: 401});
    }

    // get the ID of the job being viewed
    const {id} = await params;
    const applicationId = Number(id);

    // check if the ID is a number
    if (isNaN(applicationId)) {
      return NextResponse.json({error: "Invalid ID" }, {status: 400});
    }

    // verify the user's details
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    // new job information submitted in the form
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

    // UPDATE query for changing the job's information
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
      `, [
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

    // if nothing is returned, the job does not exist
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Application not found"}, {status: 404});
    }

    return NextResponse.json({success: true}, {status: 200});
  } catch (err) {
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}

// DELETE for deleting a job application
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // check the user who has logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({error: "Not authenticated" }, {status: 401});
    }

    // get the ID of the job being viewed
    const {id} = await params;
    const applicationId = Number(id);

    // check if the ID is a number
    if (isNaN(applicationId)) {
      return NextResponse.json({error: "Invalid ID" }, {status: 400});
    }

    // verify the user's details
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    // DELETE query for deleting the application
    await pool.query(
      `DELETE FROM applications
       WHERE id = $1 AND user_id = $2`,
      [applicationId, decoded.userId]
    );

    return NextResponse.json({message: "Application deleted" }, {status: 200});
  } catch (err) {
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}