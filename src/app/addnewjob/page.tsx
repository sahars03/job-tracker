"use client";
import { useState, type ChangeEvent } from "react";

interface FormData {
  company: string;
  jobTitle: string;
  location: string;
  jobType: string;
  workSetting: string[];
  dateApplied: string;
  status: string;
  stageReached: string;
  notes: string;
}

export default function AddNewJobPage() {
  // state to manage form submission
  const [isSubmitted, setIsSubmitted] = useState(false);
  // state to manage form error
  const [formError, setFormError] = useState(false);
  // state to manage and hold form data
  const [formData, setFormData] = useState<FormData>({
    company: "",
    jobTitle: "",
    location: "",
    jobType: "",
    workSetting: [] as string[],
    dateApplied: "",
    status: "",
    stageReached: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement; // type assertion
    const { id, value, type, checked, name } = target;
    if (type === "checkbox") {
      let newWorkSettings = [...formData.workSetting] as string[];
      // if the checkbox is checked, add the value to the workSettings array
      if (checked) {
        newWorkSettings.push(value);
      // otherwise, remove the value from the array
      } else {
          newWorkSettings = newWorkSettings.filter(setting => setting !== value);
      } 
      setFormData(prev => ({
        ...prev, workSetting: newWorkSettings
      })); 
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
      formData.company,
      formData.jobTitle,
      formData.location,
      formData.jobType,
      formData.dateApplied
    ];

    // size of the list of work settings selected
    const isWorkSettingSelected = formData.workSetting.length > 0;
    
    // check if all required fields are filled and at least one work setting has been selected
    return required.every(field => field !== "") && isWorkSettingSelected;
  };

  // sets the form to submitted state when the 'save' button is pressed
  const handleSubmit = () => {
    if (validateForm()) {
      setFormError(false);
      setIsSubmitted(true);
      // send data to backend
    } else {
      setFormError(true);
    }
  };
  
  // display depends on if the form information has been submitted
  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {!isSubmitted ? ( 
      <>
        <p className="font-sans text-6xl">Create new application</p>
        <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
        <form className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
          <div className="mb-4 flex flex-col gap-2 w-3/4">
            <label className="flex items-center gap-1">Company<span className="text-red-500">*</span></label>
            <input type="text" id="company" value={formData.company} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Company"/>
            <label className="flex items-center gap-1">Job title<span className="text-red-500">*</span></label>
            <input type="text" id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Job title"/>
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
      </>
      ) : (
        <div className="text-center">
        <p className="font-sans text-6xl">Application saved!</p>
        <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
        </div>
      )}
    </div> 
  );
}