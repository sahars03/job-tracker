"use client";
import { useState } from "react";
import { ApplicationFilters } from "@/src/types/ApplicationFilters";

type Props = {
  isOpen: boolean;
  onApply: (filters: ApplicationFilters) => void;
  onClose: () => void;
};

export default function FilterModal({ isOpen, onApply, onClose }: Props) {
  const [draftFilters, setDraftFilters] = useState<ApplicationFilters>({
    workSetting: { inperson: false, hybrid: false, remote: false },
    jobType: null,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative border border-[#eeeeee] shadow-2xl">
          <button onClick={onClose} className="absolute text-xl top-1 right-2 text-gray-500 hover:text-gray-700">
            &times;
          </button>
        <p className="font-sans font-semibold text-4xl text-center mb-3">Filter applications</p>
        <div className="h-[2px] bg-gray-300 w-full my-3"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <div className="flex flex-col gap-2">

        <label className="flex items-center gap-1">Job title</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Job title"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, jobTitle: e.target.value })
          }
        />

        <label className="flex items-center gap-1">Company</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Company"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, company: e.target.value })
          }
        />

        <label className="flex items-center gap-1">Location</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Location"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, location: e.target.value })
          }
        />

        <label className="flex items-center gap-1">Job type</label>
        <div className="flex items-center gap-4">
          {(["full-time", "part-time"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={draftFilters.jobType === type}
                onChange={() =>
                  setDraftFilters({
                    ...draftFilters,
                    jobType: type,
                  })
                }
                className="text-blue-500 focus:ring-blue-200"
              />
              {type === "full-time" ? "Full-time" : "Part-time"}
            </label>
          ))}
        </div>

<label className="flex items-center">Work setting</label>

<div className="flex flex-wrap gap-3">
  {(["inperson", "hybrid", "remote"] as const).map((key) => (
    <label
      key={key}
      className={`flex gap-2 items-center ${
        key === "remote" ? "w-full" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={draftFilters.workSetting?.[key]}
        onChange={() =>
          setDraftFilters({
            ...draftFilters,
            workSetting: {
              ...draftFilters.workSetting!,
              [key]: !draftFilters.workSetting?.[key],
            },
          })
        }
      />
      <span className="capitalize">{key}</span>
    </label>
  ))}
</div>

    </div>
    <div className="flex flex-col gap-2">


        <label className="flex items-center gap-1">Company</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Company"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, company: e.target.value })
          }
        />
              <label className="flex items-center">Date applied</label>
<div className="flex flex-col gap-4">
  <div className="flex items-center gap-4">
    <label className="flex items-center gap-1">From</label>
    <input
      type="date"
      value={
        draftFilters.dateFrom
          ? draftFilters.dateFrom.toISOString().split("T")[0]
          : ""
      }
      onChange={(e) =>
        setDraftFilters({
          ...draftFilters,
          dateFrom: e.target.value ? new Date(e.target.value) : undefined,
        })
      }
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
    />
  </div>

  <div className="flex items-center gap-9">
    <label className="flex items-center gap-1">To</label>
    <input
      type="date"
      value={
        draftFilters.dateTo
          ? draftFilters.dateTo.toISOString().split("T")[0]
          : ""
      }
      onChange={(e) =>
        setDraftFilters({
          ...draftFilters,
          dateTo: e.target.value ? new Date(e.target.value) : undefined,
        })
      }
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
    />
  </div>
  </div>

              <label className="flex items-center gap-1">Status</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Status"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, status: e.target.value })
          }
        />
              <label className="flex items-center gap-1">Stage reached</label>

        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Stage reached"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, stagereached: e.target.value })
          }
        />

      </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-[#50c878] text-white px-4 py-2 rounded"
            onClick={() => {
              onApply(draftFilters);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
/**
 *       <div className="fixed inset-0 backdrop-blur flex items-center border-black justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative border border-[#eeeeee] shadow-2xl">
          <button onClick={onClose} className="absolute text-xl top-1 right-2 text-gray-500 hover:text-gray-700">
            &times;
          </button>
        <p className="font-sans font-semibold text-4xl text-center mb-3">Filter applications</p>
        <div className="h-[2px] bg-gray-300 w-full my-3"></div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1">Job title</label>
                            <input type="text" id="jobTitle" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Job title"/>
                            <label className="flex items-center gap-1">Company</label>
                            <input type="text" id="company" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Company"/>
                            <label className="flex items-center gap-1">Location</label>
                            <input type="text" id="location" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Location"/>
                            <label className="flex items-center gap-1">Job type</label>
                                    <div className="flex items-center gap-4">
                                      <label className="flex items-center gap-2">
                                        <input type="radio" name="jobType" value="full-time" className="text-blue-500 focus:ring-blue-200"/>
                                        Full-time
                                      </label>
                                      <label className="flex items-center gap-2">
                                        <input type="radio" name="jobType" value="part-time" className="text-blue-500 focus:ring-blue-200"/>
                                        Part-time
                                      </label>
                                    </div>
                                    <label className="flex items-center">Work setting</label>
                                              <div className="flex items-center gap-4">
                                                {(["inperson", "hybrid", "remote"] as const).map((key) => (
                                                  <label key={key} className="flex items-center gap-2">
                                                    <input
                                                      type="checkbox"
                                                      checked={filters[key]}
                                                      onChange={() => onChange(key)}
                                                    />
                                                    <span className="capitalize">{key}</span>
                                                  </label>
                                                ))}
                                              </div>
              </div>
              <div className="flex flex-col gap-2">
                                  <label className="flex items-center">Date applied</label>
                                          <div className="flex-col items-center">
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center gap-1">From</label>
                                                            <input type="date" id="dateApplied" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Date applied"/>
                                                          </div>

                                                    <div className="flex items-center gap-9">
                                                      <label className="flex items-center gap-1">To</label>
                                                      <input type="date" id="dateApplied" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Date applied"/>
                                                    </div>
                                          </div>
                                  <label className="flex items-center gap-1">Status</label>
                                  <input type="text" id="status" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Status"/>
                                  <label className="flex items-center gap-1">Stage reached</label>
                                  <input type="text" id="stageReached" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" placeholder="Stage reached"/>
            </div>
        </form>

        {/*<div className="space-y-3">
          {(["inperson", "hybrid", "remote"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => onChange(key)}
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm border rounded"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[#50c878] text-white rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </div>

 * 
 */