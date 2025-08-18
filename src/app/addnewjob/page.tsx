export default function AddNewJobPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      <p className="font-sans text-6xl">Create new application</p>
        <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
      <form className="flex flex-col gap-4 w-full items-center justify-center max-w-md">
        <div className="mb-4 flex flex-col gap-2 w-3/4">
          <input type="text" id="company" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Company"/>
          <input type="text" id="jobtitle" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Job title"/>
          <input type="text" id="location" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Location"/>
          <input type="text" id="fullparttime" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Full-/part-time"/>
          <input type="text" id="remotehybridinperson" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Remote/hybrid/in-person"/>
          <input type="text" id="dateapplied" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Date applied"/>
          <input type="text" id="status" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Status"/>
          <input type="text" id="outcome" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Outcome"/>
          <input type="text" id="stagereached" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Stage reached"/>
          <input type="text" id="notes" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Notes"/>
        </div>
      </form>
    </div> 
  );
}