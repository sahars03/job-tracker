"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ApplicationModal from "@/src/components/ApplicationModal";
import { JobApplication } from "@/src/types/JobApplication";
import { useSearchParams, useRouter } from "next/navigation";


export default function ApplicationListPage() {

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appId, setAppId] = useState(0);
  const searchParams = useSearchParams();
  const updated = searchParams.get("updated");
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const getApps = async () => {
    try {
        const res = await fetch("/api/applicationlist", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.log("mistake");
        }
        
        const data = await res.json();
        setApplications(data.applications);
        setAppId(data.applications.id);

      } catch (err) {
        console.log("oops");
      }
    };
    
    getApps();
  }, []);

  useEffect(() => {
    if (updated === "true") {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.replace("/applicationlist");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updated]);

  // state for modal (null when no application is open)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // opens modal
  const openModal = (app: JobApplication) => {
    // select the application and change state to show that a modal is open
    setSelectedApp(app);
    setIsOpen(true);
  };

  // closes modal
  const closeModal = () => {
    // close the modal, then deselect the application
    setIsOpen(false);
    setSelectedApp(null);
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {showSuccess && (
        <div className="fixed bottom centre z-50 bg-gray-300 border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application updated successfully
        </div>
      )}
      {/* main page */}
      <p className="font-sans text-6xl">Your Applications</p>
      <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
      {applications.length > 0 ? ( <>
       <div className="w-full items-center justify-center max-w-[90%] overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Setting</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage Reached</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50" onClick={() => openModal(app)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/*<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {app.status}
                    </span>*/  /* this looks quite nice but i think it should be used in a different place instead */}
                    {app.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.jobType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.workSetting.join("/")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.stageReached}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative group">
                    <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-default">
                      {app.notes}
                      {app.notes.length > 0 && (
                        <div className="fixed hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-50 w-[300px] whitespace-pre-wrap cursor-default">
                          {app.notes}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
        <Link href="/addnewjob">
          <button className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
            Add new application
          </button>
        </Link>
        </div>
        </>
      ) : (
      <div className="text-center">
      <p className="text-gray-500">You have no applications yet.</p>
      <Link href="/addnewjob">
        <button className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
          Add new application
        </button>
      </Link>
      </div>
      )}
        <ApplicationModal 
          isOpen={isOpen}
          selectedApp={selectedApp!}
          onClose={closeModal}
        />
    </div>
  );
}