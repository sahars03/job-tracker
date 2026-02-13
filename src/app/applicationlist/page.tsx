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
  const notsaved = searchParams.get("notsaved") || false;
  const savedjob = searchParams.get("savedjob") || false;
  const id = searchParams.get("id") || -1;

  const router = useRouter();
  const [sortBy, setSortBy] = useState("dateDesc");
  const [emptyFilter, setEmptyFilter] = useState(false);

  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDelSuccess, setShowDelSuccess] = useState(false);
  const [showNoSave, setShowNoSave] = useState(false);
  const [showSavedJob, setShowSavedJob] = useState(false);

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
  const [loaded, setLoaded] = useState(false);

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

      case "status": {
        const statusA = a.status?.trim();
        const statusB = b.status?.trim();

        // if A is empty and B is not, A goes after B
        if (!statusA && statusB) return 1;

        // if B is empty and A is not, B goes after A
        if (statusA && !statusB) return -1;

        // if both are empty or filled, use normal alphabetical sort
        return (statusA || "").localeCompare(statusB || "");
      }

      default:
        return 0;
    }
  });
  
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
    if (notsaved === "true") {
      setShowNoSave(true);

      const timer = setTimeout(() => {
        setShowNoSave(false);
        router.replace("/applicationlist");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notsaved]);

  useEffect(() => {
    if (savedjob === "true") {
      setShowSavedJob(true);

      const timer = setTimeout(() => {
        setShowSavedJob(false);
        router.replace("/applicationlist");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [savedjob]);

  useEffect(() => {
    if (deleted === "true") {
      setShowDelSuccess(true);
      console.log("ID: ", id);
      setApplications(prev =>
        prev.filter(app => app.id !== Number(id))
      );
      const timer = setTimeout(() => {
        setShowDelSuccess(false);
        router.replace("/applicationlist");
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

  const formatWorkSetting = (settings: string[]) => {
    let res = "";
    settings.forEach(function (item) {
      if (item === "inperson") {
        res += "In-person";
      } else {
        res += item.charAt(0).toUpperCase() + item.slice(1);
      };
      res += "/";
    });

    return res.slice(0, -1);
  };

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
      setLoaded(true);
      if (applications.length === 0) {
        setEmptyFilter(true);
      }

      setAppId(data.applications.id);
    };

    fetchApps();
  }, [filters]);

  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {showEditSuccess && (
        <div className="fixed bottom centre z-50 bg-[#82b1b1] border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application updated successfully
        </div>
      )}
      {showDelSuccess && (
        <div className="fixed bottom centre z-50 bg-[#82b1b1] border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application deleted successfully
        </div>
      )}
      {showNoSave && (
        <div className="fixed bottom centre z-50 bg-[#82b1b1] border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application not saved
        </div>
      )}
      {showSavedJob && (
        <div className="fixed bottom centre z-50 bg-[#82b1b1] border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
          Application saved successfully
        </div>
      )}
      {/* main page */}
      {loaded ? ( <>
      <p className="font-sans text-6xl">Your Applications</p>
      <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
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
      {applications.length > 0 ? ( <>
       <div className="w-full items-center justify-center max-w-[95%] overflow-x-auto">
          
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-[#82b1b1]">
              <tr>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Job Type</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Work Setting</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Stage Reached</th>
                <th className="px-6 py-3 text-left text-s font-bold text-gray-200 tracking-wider">Notes</th>
              </tr>
            </thead>
            {/**  #deffff*/}
            <tbody className="bg-[#f9efef] divide-y divide-gray-500">
              {sortedApplications.map((app) => (
                <tr key={app.id}   className="hover:bg-[#93c2c2] cursor-pointer"
 onClick={() => openModal(app)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/*<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {app.status}
                    </span>*/  /* this looks quite nice but i think it should be used in a different place instead */}
                    {app.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.jobType.charAt(0).toUpperCase()+app.jobType.slice(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatWorkSetting(app.workSetting)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.stageReached}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 relative group">
                    <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-default">
                      {app.notes}
                      {app.notes && (
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
        emptyFilter ? (
          <div className="text-center">
            <p className="text-gray-500">No results have been found.</p>
              <button 
              onClick={handleClearFilters}
              className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
                Clear filters
              </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">You have no applications yet.</p>
            <Link href="/addnewjob">
              <button className="bg-[#50c878] hover:bg-[#61d989] mt-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
                Add new application
              </button>
            </Link>
          </div>
        )
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
      </>
      ) : (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
      )}
    </div>
  );
}