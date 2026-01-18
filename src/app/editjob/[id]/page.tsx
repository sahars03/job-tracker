"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, type ChangeEvent } from "react";
import Link from "next/link";
import { JobApplication } from "@/src/types/JobApplication";

export default function EditJobPage() {
  const params = useParams();
  const id = Number(params.id);

  // state to manage form submission
  const [isSubmitted, setIsSubmitted] = useState(false);
  // state to manage form error
  const [formError, setFormError] = useState(false);
  // state to manage and hold form data
  const [formData, setFormData] = useState<JobApplication>({
    id: id,
    jobTitle: "",
    company: "",
    location: "",
    jobType: "",
    workSetting: [] as string[],
    dateApplied: "",
    status: "",
    stageReached: "",
    notes: ""
  });
  //const [loading, setLoading] = useState(true);

  const formatDateForInput = (isoDate: string) => {
    return isoDate.split("T")[0];
  };

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`/api/application/${params.id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to load job");
        return;
      }

      const data: JobApplication = await res.json();
      setFormData({
        ...data,
        dateApplied: formatDateForInput(data.dateApplied),
      });      //setLoading(false);
    };

    fetchJob();
  }, [params.id]);

  // handles input changes for text inputs, radio buttons, and checkboxes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // input that triggered the change event
    const target = e.target as HTMLInputElement;
    // destructure the target to extract relevant information
    const { id, value, type, checked, name } = target;

    // if the input type is a checkbox, it means that the user is (de)selecting a work setting
    if (type === "checkbox") {
      // copy of the existing work settings list
      let newWorkSettings = [...formData.workSetting] as string[];
      // if the checkbox is checked, add the value to the workSettings array
      if (checked) {
        newWorkSettings.push(value);
      // otherwise, remove the value from the array
      } else {
          newWorkSettings = newWorkSettings.filter(setting => setting !== value);
      }
      // update the formData state with the new work settings list
      setFormData(prev => ({
        ...prev, workSetting: newWorkSettings
      })); 
    // otherwise, update the formData state with the new value
    // depending on what information is available, either the id or name will be used as the key for updating
    } else {
      setFormData(prev => ({ 
        ...prev, [id || name]: value
      }));
    }
  };
  
  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // list of required fields
    const required = [
      formData.jobTitle,
      formData.company,
      formData.location,
      formData.jobType,
      formData.dateApplied
    ];

    // size of the list of work settings selected
    const isWorkSettingSelected = formData.workSetting.length > 0;
    
    // check if all required fields are filled and at least one work setting has been selected
    return required.every(field => field !== "") && isWorkSettingSelected;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setFormError(true);
      return;
    }

    try {
      // TODO: update this for editing application
      const res = await fetch("/api/addnewjob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save application");
      }

      setFormError(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setFormError(true);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {!isSubmitted ? ( <>
        <p className="font-sans text-6xl">Edit application</p>
        <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
        <form className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
          <div className="mb-4 flex flex-col gap-2 w-3/4">
            <label className="flex items-center gap-1">Job title<span className="text-red-500">*</span></label>
            <input type="text" id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Job title"/>
            <label className="flex items-center gap-1">Company<span className="text-red-500">*</span></label>
            <input type="text" id="company" value={formData.company} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Company"/>
            <label className="flex items-center gap-1">Location<span className="text-red-500">*</span></label>
            <input type="text" id="location" value={formData.location} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Location"/>
            <label className="flex items-center gap-1">Job type<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="jobType" value="full-time" checked={formData.jobType=="full-time"} onChange={handleInputChange} required className="text-blue-500 focus:ring-blue-200"/>
                Full-time
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="jobType" value="part-time" checked={formData.jobType=="part-time"} onChange={handleInputChange} required className="text-blue-500 focus:ring-blue-200"/>
                Part-time
              </label>
            </div>
            <label className="flex items-center gap-1">Work setting<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="workSetting" value="inperson" checked={formData.workSetting.includes("inperson")} onChange={handleInputChange} required className="text-blue-500 focus:ring-blue-200"/>
                In-person
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="workSetting" value="hybrid" checked={formData.workSetting.includes("hybrid")} onChange={handleInputChange} required className="text-blue-500 focus:ring-blue-200"/>
                Hybrid
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="workSetting" value="remote" checked={formData.workSetting.includes("remote")} onChange={handleInputChange} required className="text-blue-500 focus:ring-blue-200"/>
                Remote
              </label>
            </div>
            <label className="flex items-center gap-1">Date applied<span className="text-red-500">*</span></label>
            <input type="date" id="dateApplied" value={formData.dateApplied} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Date applied"/>
            <label className="flex items-center gap-1">Status</label>
            <input type="text" id="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Status"/>
            <label className="flex items-center gap-1">Stage reached</label>
            <input type="text" id="stageReached" value={formData.stageReached} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Stage reached"/>
            <label className="flex items-center gap-1">Notes</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Notes"/>
            </div>
        </form>
        <button onClick={handleSubmit} className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
          Save
        </button>
        {formError && (
          <p className="text-red-500 text-sm mb-4">Please fill in all required fields</p>
        )}
        <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
        <p className="text-gray-500 text-sm"><span className="text-red-500">*</span> Required fields</p>
      </> ) : (
        <div className="text-center">
          <p className="font-sans text-6xl">Application saved!</p>
          <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
          <Link href="/applicationlist">
            <button className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
              View applications
            </button>
          </Link>
        </div>
      )}
    </div> 
  );
}