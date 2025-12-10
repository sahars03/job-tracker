"use client";

import { useState } from "react";
import Link from "next/link"

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [retyped, setRetyped] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "retype") {
      // @ts-ignore
      setRetyped(e.target.value);
    }
  };

  const validatePassword = () => {
    console.log(formData.password);
    console.log(`${retyped}???`);
    return formData.password === retyped
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // list of required fields
    const required = [
      formData.email,
      formData.password
    ];
    
    // check if all required fields are filled
    return required.every(field => field !== "") && validatePassword();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(false);
    setPwError(false);
    
    // if the form has been validated, the formError state can be updated to reflect this
    if (validateForm()) {
      try {
        console.log("fetch");
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!res.ok) {
            console.log("oops");
          }

          if (res.ok) {
            setIsSubmitted(true);
            alert("It worked!");
          } else {
            let data;
            try {
              data = await res.json();
            } catch (jsonErr) {
              console.error("Could not parse JSON:", jsonErr);
              data = { error: "Unknown error" };
            }
            ///do i need these lines
            //console.error(data.error);
            //setFormError(true);
          }
        } catch (err) {
          console.error("Error submitting form:", err);
          setFormError(true);
        }

    // otherwise, there has been an error
    } else {
      console.log("mistake");
      if (!validatePassword()) {
        console.log("invalid pw");
        setPwError(true);
      }
      setFormError(true);

      // if (pwError && formError) {
      //   alert("message")
      // }
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      {!isSubmitted ? ( <>
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
        <button type="submit" className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-4 py-2 font-bold w-[150px] text-xl">Register</button>
        {pwError && (
          <p className="text-red-500 text-sm mb-4">Passwords do not match</p>
        )}
        {formError && !pwError && (
          <p className="text-red-500 text-sm mb-4">Please fill in all required fields</p>
        )}
      </form>

      <div className="h-[2px] bg-gray-300 my-4 w-1/2"></div>
      <div className="flex gap-1">
        <span className="text-m"><i>Already registered?</i></span>
        <Link href="/login" className="text-blue-500 hover:underline text-m">
          <i>Log in</i>
        </Link>
      </div>
      </> ) : (
        <div className="text-center">
          <p className="font-sans text-6xl">Registration successful!</p>
          <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
          <Link href="/login">
            <button className="bg-[#4a90e2] hover:bg-[#5ba1f3] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
              Log in
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}