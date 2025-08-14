import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <p className="font-sans text-6xl text-center sm:text-left">Register</p>
      <div className="h-[2px] bg-gray-300 w-1/2 my-4"></div>
      <p className="mb-6 text-xl">Fill out the form below to register.</p>
      <form className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="name" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Username"/>
          <input type="text" id="email" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Email*"/>
          <input type="text" id="password" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Password*"/>
        </div>
      </form>
        <button className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-4 py-2 font-bold w-[150px] text-xl">Register</button>
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