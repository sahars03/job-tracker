"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    un_email: "",
    password: "",
  });

  const [nameError, setNameError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // update the form inputs every time they are changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateAccount = () => {
    // TODO: replace this logic with checking at the backend if the login is correct

    return formData.password == formData.password;
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // list of required fields
    const required = [
      formData.un_email,
      formData.password
    ];
    
    // check if all required fields are filled
    return required.every(field => field !== "") && validateAccount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(false);
    setPwError(false);
    setFormError(false);
    // TODO: validate input and redirect the user to their dashboard (maybe the homepage for now?)
    if (validateForm()) {
      try {
          const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (res.ok) {
            setIsSubmitted(true);
            router.push("/mainpage");
          } else {
            let data;
            try {
              data = await res.json();

              if (res.status === 404) {
                // user not found
                setNameError(true);
              } else if (res.status === 401) {
                // incorrect password
                setPwError(true);
              }
            } catch (jsonErr) {
              console.error("Could not parse JSON:", jsonErr);
              data = { error: "Unknown error" };
            }

          }
      } catch (err) {
        console.error("Error submitting form:", err);
        setFormError(true);
      }
    } else {
      setFormError(true);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
    {!isSubmitted ? ( <>
      <p className="font-sans text-6xl text-center sm:text-left">Log in</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to log in.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="un_email" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username/email"/>
          <input type="password" id="password" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password"/>
        </div>
        {pwError && !nameError && !formError && (
          <p className="text-red-500 text-sm mb-4">Incorrect password</p>
        )}
        {nameError && !pwError && !formError && (
          <p className="text-red-500 text-sm mb-4">Username/email does not exist</p>
        )}
        {formError && !nameError && !pwError && (
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
      </> ) : (
        <div className="text-center">
          <p className="font-sans text-6xl">Login successful!</p>
          <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
            <button className="bg-[#4a90e2] hover:bg-[#5ba1f3] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
              Main page
            </button>
        </div>
      )}
    </div>
  );
}