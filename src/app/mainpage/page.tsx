import Link from "next/link"

export default function MainPage() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <div className="-mt-64 flex flex-col items-center ">
        <p className="font-sans text-5xl">Home</p>
        <Link href="../">
        <button className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
          New application
        </button>
        </Link>
      </div>
    </div>
  );
}