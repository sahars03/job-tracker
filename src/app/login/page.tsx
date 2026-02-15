"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {

  // login authentication and router
  const { refreshAuth } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(useSearchParams().get("registered") || "");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // holds the data that the user inputs
  const [formData, setFormData] = useState({
    un_email: "",
    password: "",
  });

  // if the user has reached this page after registering, a popup should appear, controlled through the state that the effect changes
  useEffect(() => {
    if (searchQuery === "true") {
      setRegistrationSuccess(true);

      const timer = setTimeout(() => {
        setSearchQuery("");
        setRegistrationSuccess(false);
        router.push("/login");
      }, 3000);
    
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // state variables for tracking if there is an error with the form before or after the login attempt
  const [formError, setFormError] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  // update the form inputs every time they are changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // list of required fields
    const required = [
      formData.un_email,
      formData.password
    ];
    
    // check if all required fields are filled
    return required.every(field => field !== "");
  };

  // handles submission of login details
  const handleSubmit = async (e: React.FormEvent) => {
    // prevent the page from being refreshed automatically
    e.preventDefault();

    // restore states to assume there is no problem
    setSubmissionError(false);
    setFormError(false);
    
    // if the form is valid, its contents can be used in a login attempt
    if (validateForm()) {
      try {
        // POST request for login attempt
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        // if the login attempt is successful, the login state is updated and the user's applications are displayed
        if (res.ok) {
          await refreshAuth();
          router.push("/applicationlist");
        // otherwise, there is an error with the user's credentials
        } else {
          setSubmissionError(true);
        }

      } catch (err) {
        setSubmissionError(true);
      }
    // otherwise, there is an issue with the form's fields
    } else {
      setFormError(true);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {registrationSuccess && (
        <div className="fixed bottom centre z-50 bg-[#82b1b1] border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Account created
        </div>
      )}
      <p className="font-sans text-6xl text-center sm:text-left">Log in</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to log in.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="un_email" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username/email"/>
          <input type="password" id="password" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password"/>
        </div>
        {submissionError && (
          <p className="text-red-500 text-sm mb-4">Invalid credentials</p>
        )}
        {formError && (
          <p className="text-red-500 text-sm mb-4">Please fill in all required fields</p>
        )}
        <button type="submit" className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-2 font-bold w-[150px] text-xl">
          Log in
        </button>    
      </form>  
      <Link href="/forgotpw" className="text-blue-500 hover:underline text-m">
        Forgotten password?
      </Link>
      <div className="h-[2px] bg-gray-300 my-4 w-1/2"></div>
      <div className="flex gap-1">
        <span className="text-m"><i>No account?</i></span>
        <Link href="/register" className="text-blue-500 hover:underline text-m">
          <i>Register</i>
        </Link>
      </div>
    </div>
  );
}