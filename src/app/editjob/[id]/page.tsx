"use client";

import { useParams } from "next/navigation";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <h1>Edit Application</h1>
      <p>Editing job with ID: {id}</p>
    </div>
  );
}