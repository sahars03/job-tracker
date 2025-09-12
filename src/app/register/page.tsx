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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if the form has been validated, the formError state can be updated to reflect this
    if (validateForm()) {
      setFormError(false);

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration successful!");
      } else {
        alert("Something went wrong while trying to register.");
      }

    // otherwise, there has been an error
    } else {
      setFormError(true);
      alert("There is an issue in the form.");
    }
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // list of required fields
    const required = [
      formData.email,
      formData.password
    ];
    
    // check if all required fields are filled
    return required.every(field => field !== "");
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <p className="font-sans text-6xl text-center sm:text-left">Register</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to register.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="name" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username"/>
          <input type="text" id="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Email*"/>
          <input type="text" id="password" required value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password*"/>
        </div>
      </form>
        <button type="submit" className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-4 py-2 font-bold w-[150px] text-xl">Register</button>
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