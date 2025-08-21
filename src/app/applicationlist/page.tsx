import Link from "next/link";

export default function ApplicationListPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      <p className="font-sans text-6xl">Your Applications</p>
      <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
      <p className="text-gray-500">You have no applications yet.</p>
      <Link href="/addnewjob">
        <button className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
          Add new application
        </button>
      </Link>
    </div>
  );
}