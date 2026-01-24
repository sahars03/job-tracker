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
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-3xl font-semibold mb-4">Filter applications</h2>

        <input
          placeholder="Job title"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, jobTitle: e.target.value })
          }
        />

        <input
          placeholder="Company"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, company: e.target.value })
          }
        />

        <div className="flex gap-4 mb-4">
          {(["inperson", "hybrid", "remote"] as const).map((key) => (
            <label key={key} className="flex gap-2 items-center">
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
              {key}
            </label>
          ))}
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
  );
}