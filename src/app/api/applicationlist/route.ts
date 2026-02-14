import { NextResponse } from "next/server";
import pool from "@/backend/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    // check the user who has logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({error: "Not authenticated" }, {status: 401});
    }

    // verify the user's details
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

  // filters for the specific applications that the user wants to see
  const filters = await req.json();

  // initial SELECT query
  let query = `
    SELECT *
    FROM applications
    WHERE user_id = $1
  `;

  // store of parameters for the final query
  const values: any[] = [decoded.userId];
  let i = 2;

  // if the user wants to filter by job title, include this in the query
  if (filters.jobTitle) {
    query += ` AND job_title ILIKE $${i++}`;
    values.push(`%${filters.jobTitle}%`);
  }

  // if the user wants to filter by company name, include this in the query
  if (filters.company) {
    query += ` AND company ILIKE $${i++}`;
    values.push(`%${filters.company}%`);
  }

  // if the user wants to filter by job location, include this in the query
  if (filters.location) {
    query += ` AND job_location ILIKE $${i++}`;
    values.push(`%${filters.location}%`);
  }

  // if the user wants to filter by job type, include this in the query
  if (filters.jobType === "full-time") {
    query += ` AND job_type = 'full-time'`;
  }

  if (filters.jobType === "part-time") {
    query += ` AND job_type = 'part-time'`;
  }

  // store of selected work settings
  const selectedWorkSettings: string[] = [];

  // include each work setting that the user has selected in the list
  if (filters.workSetting?.inperson) selectedWorkSettings.push("inperson");
  if (filters.workSetting?.hybrid) selectedWorkSettings.push("hybrid");
  if (filters.workSetting?.remote) selectedWorkSettings.push("remote");

  // add all of the selected work settings to the query
  if (selectedWorkSettings.length > 0) {
    query += ` AND work_setting && $${i++}::varchar[]`;
    values.push(selectedWorkSettings);
  }

  // if the user wants to filter by dates, include these in the query
  if (filters.dateFrom) {
    query += ` AND date_applied >= $${i++}`;
    values.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    query += ` AND date_applied <= $${i++}`;
    values.push(filters.dateTo);
  }

  // if the user wants to filter by job status, include this in the query
  if (filters.status) {
    query += ` AND app_status ILIKE $${i++}`;
    values.push(`%${filters.status}%`);
  }

  // if the user wants to filter by stage reached, include this in the query
  if (filters.stagereached) {
    query += ` AND stage_reached ILIKE $${i++}`;
    values.push(`%${filters.stagereached}%`);
  }

  // execute the query
  const result = await pool.query(query, values);

  // retrieve all of the jobs matching the filters and prepare them for returning
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
    {message: "Found applications", applications: apps,},
    {status: 200}
  );
}