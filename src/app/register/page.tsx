"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function RegisterPage() {

  const router = useRouter();

  // holds the data that the user inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  // state variables for tracking if there is an error with the form before or after the registration attempt
  const [formError, setFormError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [retyped, setRetyped] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const [whitespaceError, setWhitespaceError] = useState(false);

  // update the form inputs every time they are changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "retype") {
      setRetyped(e.target.value);
    }
  };

  // checks if the given field contains any whitespace, which would make it invalid
  const validateField = (field: string) => {
    if (!field || /\s/.test(field)) {
      setWhitespaceError(true);
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
    // list of required fields
    const required = [
      formData.email,
      formData.password
    ];
    
    // check if all required fields are filled, the fields do not contain whitespace and the passwords match
    return required.every(field => field !!= "" && validateField(field)) && validatePassword();
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
    
    // if the form is valid, its contents can be used in a registration signup attempt
    if (validateForm()) {
      try {
        // POST request for registration attempt
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        // if the registration is successful, move the user to the login page
        if (res.ok) {
          router.push("/login?registered=true");
        // otherwise, the account could not be created
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
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      <p className="font-sans text-6xl text-center sm:text-left">Register</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to register.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username"/>
          <input type="text" id="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Email*"/>
          <input type="password" id="password" required value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password*"/>
          <input type="password" id="retype" required value={retyped} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Retype password*"/>
        </div>
        {pwError && (
          <p className="text-red-500 text-sm mb-4">Passwords do not match</p>
        )}
        {formError && !pwError && !whitespaceError && (
          <p className="text-red-500 text-sm mb-4">Please fill in all required fields</p>
        )}
        {whitespaceError && (
          <p className="text-red-500 text-sm mb-4">Invalid details</p>
        )}
        {submissionError && (
          <p className="text-red-500 text-sm mb-4">Unable to register</p>
        )}
        <button type="submit" className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-4 py-2 font-bold w-[150px] text-xl">Register</button>
      </form>
      <div className="h-[2px] bg-gray-300 my-4 w-1/2"></div>
      <div className="flex gap-1">
        <span className="text-m"><i>Already registered?</i></span>
        <Link href="/login" className="text-blue-500 hover:underline text-m">
          <i>Log in</i>
        </Link>
      </div>
    </div>
  );
}