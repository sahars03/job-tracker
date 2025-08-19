'use client';
import { useState } from 'react';

export default function AddNewJobPage() {
  // state to manage form submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  // sets the form to submitted state when the 'save' button is pressed
  const handleSubmit = () => {
    setIsSubmitted(true);
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
            <input type="text" id="company" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Company"/>
            <label className="flex items-center gap-1">Job title<span className="text-red-500">*</span></label>
            <input type="text" id="jobtitle" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Job title"/>
            <label className="flex items-center gap-1">Location<span className="text-red-500">*</span></label>
            <input type="text" id="location" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Location"/>
            <label className="flex items-center gap-1">Job type<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="fullparttime" value="full-time" required className="text-blue-500 focus:ring-blue-200"/>
                Full-time
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="fullparttime" value="part-time" required className="text-blue-500 focus:ring-blue-200"/>
                Part-time
              </label>
            </div>
            <label className="flex items-center gap-1">Work setting<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="worksetting" value="inperson" required className="text-blue-500 focus:ring-blue-200"/>
                In-person
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="worksetting" value="hybrid" required className="text-blue-500 focus:ring-blue-200"/>
                Hybrid
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="worksetting" value="remote" required className="text-blue-500 focus:ring-blue-200"/>
                Remote
              </label>
            </div>
            <label className="flex items-center gap-1">Date applied<span className="text-red-500">*</span></label>
            <input type="date" id="dateapplied" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Date applied"/>
            <label className="flex items-center gap-1">Status</label>
            <input type="text" id="status" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Status"/>
            <label className="flex items-center gap-1">Stage reached</label>
            <input type="text" id="stagereached" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Stage reached"/>
            <label className="flex items-center gap-1">Notes</label>
            <textarea id="notes" name="notes" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Notes"/>
            </div>
        </form>
        <button onClick={handleSubmit} className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
          Save
        </button>
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