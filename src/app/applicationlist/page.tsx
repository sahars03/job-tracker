"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ApplicationModal from "@/src/components/ApplicationModal";
import { JobApplication } from "@/src/types/JobApplication";
import { ApplicationFilters } from "@/src/types/ApplicationFilters";
import { useSearchParams, useRouter } from "next/navigation";
import FilterModal from "@/src/components/FilterModal";

export default function ApplicationListPage() {

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appId, setAppId] = useState(0);
  const searchParams = useSearchParams();
  const edited = searchParams.get("edited") || false;
  const deleted = searchParams.get("deleted") || false;
  const router = useRouter();
  const [sortBy, setSortBy] = useState("dateDesc");

  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDelSuccess, setShowDelSuccess] = useState(false);
  const DEFAULT_FILTERS: ApplicationFilters = {
    jobTitle: "",
    company: "",
    location: "",
    jobType: undefined,
    workSetting: {
      inperson: false,
      hybrid: false,
      remote: false,
    },
    dateFrom: undefined,
    dateTo: undefined,
    status: "",
    stagereached: "",
  };

  const [filters, setFilters] = useState<ApplicationFilters>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<ApplicationFilters>(DEFAULT_FILTERS);


  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setShowFilter(false);
  };

  const handleClearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setShowFilter(false);
  };

  const openFilterModal = () => {
    setDraftFilters(filters); // clone current applied filters
    setShowFilter(true);
  };


  const sortedApplications = [...applications].sort((a, b) => {
    switch (sortBy) {
      case "dateAsc":
        return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();

      case "dateDesc":
        return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();

      case "company":
        return a.company.localeCompare(b.company);

      case "status":
        return a.status.localeCompare(b.status);

      default:
        return 0;
    }
  });
  
  useEffect(() => {
    const fetchApps = async () => {
      const res = await fetch("/api/applicationlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
        credentials: "include",
      });

      const data = await res.json();
      setApplications(data.applications);
      setAppId(data.applications.id);
    };

    fetchApps();
  }, [filters]);

  useEffect(() => {
    if (edited === "true") {
      setShowEditSuccess(true);

      const timer = setTimeout(() => {
        setShowEditSuccess(false);
        router.replace("/applicationlist");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [edited]);

  useEffect(() => {
    if (deleted === "true") {
      setShowDelSuccess(true);

      const timer = setTimeout(() => {
        setShowDelSuccess(false);
        router.replace("/applicationlist");
        router.refresh();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [deleted]);

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
      {showEditSuccess && (
        <div className="fixed bottom centre z-50 bg-gray-300 border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application updated successfully
        </div>
      )}
      {showDelSuccess && (
        <div className="fixed bottom centre z-50 bg-gray-300 border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application deleted successfully
        </div>
      )}
      {/* main page */}
      <p className="font-sans text-6xl">Your Applications</p>
      <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
      {applications.length > 0 ? ( <>
       <div className="w-full items-center justify-center max-w-[90%] overflow-x-auto">
          <div className="flex justify-end w-full max-w-[90%] mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilter(true)}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Filter
              </button>
              <label className="text-sm font-medium text-gray-600">
                Sort by:
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="dateDesc">Date applied (newest)</option>
                <option value="dateAsc">Date applied (oldest)</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
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
              {sortedApplications.map((app) => (
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
    <FilterModal
      isOpen={showFilter}
      draftFilters={draftFilters}
      setDraftFilters={setDraftFilters}
      onApply={(newFilters) => {
        setFilters(newFilters);
      }}
      onClose={() => setShowFilter(false)}
    />
    </div>
  );
}