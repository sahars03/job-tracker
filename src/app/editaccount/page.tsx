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
  const [pwError, setPwError] = useState(false);
  const [retyped, setRetyped] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const [whitespaceError, setWhitespaceError] = useState(false);

  const { refreshAuth } = useAuth();

  // holds the data that the user inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

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
        console.log("oops");
      }
    };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "retype") {
      // @ts-ignore
      setRetyped(e.target.value);
    }
  };

  // checks if the given field contains any whitespace, which would make it invalid
  const validateField = (field: string) => {
    if (/\s/.test(field)) {
      setWhitespaceError(true);
      return false;
    }
    return true;
  }

  // checks if the retyped and original passwords are the same
  const validatePassword = () => {
    // validate other things as well e.g. if there is already a user with the given username/email
    return formData.password === retyped
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // also check that at least one of the fields has been updated, and if it is the password, make sure it has been retyped correctly

    if (Object.values(formData).every((value) => value === "")) {
        setFormError(true);
        return false;
    }

    // iterate through the data
    for (const [key, value] of Object.entries(formData)) {
      console.log(key, value);
      if (value !== "" && !validateField(value)) {
          setWhitespaceError(true);
          return false;
      }
    };

    return validatePassword();  
  };

  // handles submission of registration details
  const handleSubmit = async (e: React.FormEvent) => {
    // prevent the page from being refreshed automatically
    e.preventDefault();

    // restore states to assume there is no problem
    setFormError(false);
    setPwError(false);
    setSubmissionError(false);
    setWhitespaceError(false);
    
    // if the form is valid, its contents can be used in an edit attempt
    if (validateForm()) {
      try {
        // POST request for registration attempt
          const res = await fetch("/api/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
        
        // if the registration is successful, move the user to the login page
        if (res.ok) {
            router.push("/account?updated=true");        // otherwise, the account could not be created
        } else {
          setSubmissionError(true);
        }
      } catch (err) {
        setFormError(true);
      }

    // otherwise, there has been an error in the form
    } else {
      // check if the passwords are mismatched
      if (!validatePassword()) {
        setPwError(true);
      }
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