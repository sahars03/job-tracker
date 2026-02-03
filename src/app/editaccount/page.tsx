"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, type ChangeEvent } from "react";
import Link from "next/link";

export default function EditAccountPage() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
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
        }
      } catch {
        console.log("oops");
      }
    };

    checkAuth();
  }, []);

  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

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
    // validate other things as well e.g. if there is already a user with the given username/email
    return formData.password === retyped
  };

  // validates form data by checking if all the required fields have been filled in
  const validateForm = () => {
    // also check that at least one of the fields has been updated, and if it is the password, make sure it has been retyped correctly

    if (Object.values(formData).every((value) => value === "")) {
        setFormError(true);
        setFormErrorMsg("No fields have been filled")
        return false;
    }

    return validatePassword();  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(false);
    setPwError(false);
    
    // if the form has been validated, the formError state can be updated to reflect this
    if (validateForm()) {
      try {
        console.log("post");
          const res = await fetch("/api/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          
          if (res.ok) {
            setIsSubmitted(true);
            router.push("/account?updated=true");
          } else {
            let data;
            try {
              data = await res.json();
            } catch (jsonErr) {
              console.error("Could not parse JSON:", jsonErr);
              data = { error: "Unknown error" };
            }
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
        setFormErrorMsg("Passwords do not match")
      }
      setFormError(true);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      {!isSubmitted ? ( <>
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
        <button type="submit" className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-4 py-2 font-bold w-[150px] text-xl">Update details</button>
        {formError && (
          <p className="text-red-500 text-sm mb-4">{formErrorMsg}</p>
        )}
      </form>
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