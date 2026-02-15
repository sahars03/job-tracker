"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

export default function EditAccountPage() {

  const router = useRouter();

  // state for changing the display if the page has loaded
  const [loaded, setLoaded] = useState(false);

  // state variables for tracking if there is an error with the form before or after the registration attempt
  const [formError, setFormError] = useState(false);
  const [retyped, setRetyped] = useState("");
  const [submissionError, setSubmissionError] = useState(false);

  // holds the data that the user inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // checks if the user is logged in so that the user's details can be stored
  const checkAuth = async () => {
    try {
      const res = await fetch("api/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({
          username: data.username ?? "",
          email: data.email ?? "",
          password: "",
        });
        setLoaded(true);
      }
    } catch {
        console.error("Cannot retrieve account information");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // stores the new information that the user wants to save as it updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "retype") {
      setRetyped(e.target.value);
    }
  };

  // checks if the given field contains any whitespace, which would make it invalid
  const validateField = (field: string) => {
    if (/\s/.test(field)) {
      return false;
    }
    return true;
  }

  // checks if the retyped and original passwords are the same
  const validatePassword = () => {
    return formData.password === retyped
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // if none of the fields have been edited, there is no change required
    if (Object.values(formData).every((value) => value === "")) {
        setFormError(true);
        return false;
    }

    // iterate through the data
    for (const [key, value] of Object.entries(formData)) {
      // check if the field has been filled in correctly
      if (value !== "" && !validateField(value)) {
          return false;
      }
    };

    // validate the password
    return validatePassword();  
  };

  // handles submission of registration details
  const handleSubmit = async (e: React.FormEvent) => {
    // prevent the page from being refreshed automatically
    e.preventDefault();

    // restore states to assume there is no problem
    setFormError(false);
    setSubmissionError(false);
    
    // if the form is valid, its contents can be used in an edit attempt
    if (validateForm()) {
      try {
        // PUT request for edit attempt
        const res = await fetch("/api/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        // if the edit is successful, take the user back to the account page
        if (res.ok) {
            router.push("/account?updated=true");
        // otherwise, the account could not be edietd
        } else {
          setSubmissionError(true);
        }
      } catch (err) {
        setFormError(true);
      }
    // otherwise, there has been an error in the form
    } else {
      setFormError(true);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      {loaded ? ( <>
        <p className="font-sans text-6xl text-center sm:text-left">Edit account</p>
        <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
        <p className="mb-6 text-xl">Fill out all of the fields that require changing</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
          <div className="mb-4 flex flex-col gap-2 w-3/4">
            <input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username"/>
            <input type="text" id="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Email"/>
            <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password"/>
            <input type="password" id="retype" value={retyped} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Retype password"/>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => router.replace("/account?updated=false")}
              className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-2 font-bold w-[150px] text-xl whitespace-normal text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-2 font-bold w-[150px] text-xl"
            >
              Update details
            </button>
          </div>
        </form>
        {formError && (
          <p className="text-red-500 text-sm mb-4">Invalid details</p>
        )}
        {submissionError && (
          <p className="text-red-500 text-sm mb-4">Unable to update account</p>
        )}
      </> ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}