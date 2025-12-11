import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {

  const [formData, setFormData] = useState({
    un_email: "",
    password: "",
  });

  const [formError, setFormError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // update the form inputs every time they are changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = () => {
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
    return required.every(field => field !== "") && validatePassword();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(false);
    setPwError(false);
    // TODO: validate input and redirect the user to their dashboard (maybe the homepage for now?)
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <p className="font-sans text-6xl text-center sm:text-left">Log in</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to log in.</p>
      <form className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="un_email" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username/email"/>
          <input type="text" id="password" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password"/>
        </div>
      </form>
      <Link href="/mainpage">
        <button className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-2 font-bold w-[150px] text-xl">
          Log in
        </button>      
      </Link>
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