import { JobApplication } from "@/src/types/JobApplication";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApplicationModalProps {
  isOpen: boolean;
  selectedApp: JobApplication;
  onClose: () => void;
  onDelete?: (id: number) => void;
}

const ApplicationModal = ({ isOpen, selectedApp, onClose, onDelete }: ApplicationModalProps) => {
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  if (!isOpen || !selectedApp) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(selectedApp.id);
      onClose();
    }
  };

  return (
      <div className="fixed inset-0 backdrop-blur flex items-center border-black justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative border border-[#eeeeee] shadow-2xl">
          <button onClick={onClose} className="absolute text-xl top-1 right-2 text-gray-500 hover:text-gray-700">
            &times;
          </button>
          <div className="flex items-center flex-col justify-center">
            <p className="font-sans font-semibold text-4xl text-center mb-3">{selectedApp.jobTitle} at {selectedApp.company}</p>
            <p className="font-sans text-xl italic">Status: {selectedApp.status}</p>
          </div>
          <div className="h-[2px] bg-gray-300 w-full my-3"></div>
          <p><span className="font-sans font-semibold">Location:</span> {selectedApp.location}</p>
          <p><span className="font-sans font-semibold">Date Applied:</span> {new Date(selectedApp.dateApplied).toLocaleDateString()}</p>
          <p><span className="font-sans font-semibold">Job Type:</span> {selectedApp.jobType}</p>
          <p><span className="font-sans font-semibold">Work Setting:</span> {selectedApp.workSetting.join("/")}</p>
          <p><span className="font-sans font-semibold">Stage Reached:</span> {selectedApp.stageReached}</p>
          <div className="h-[2px] bg-gray-300 w-full my-3"></div>
          <p className="mt-2"><span className="font-sans font-semibold">Notes:</span></p>
          <p className="whitespace-pre-wrap font-sans">{selectedApp.notes || "No additional notes."}</p>
          <div className="flex flex-row justify-center mb-3 gap-4 mt-6">
            <button onClick={() => {
              onClose();
              router.push(`/editjob/${selectedApp.id}/`);
            }}
            className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
              Edit
            </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="bg-[#d7551f] hover:bg-[#e8662f] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl">
            Delete
          </button>
          </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur flex items-center border-black justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="font-sans font-semibold text-2xl text-center mb-3">Confirm Delete</h3>
              <p className="font-sans text-center text-lg mb-2">Are you sure you want to delete this application?</p>
            <div className="flex flex-row justify-center gap-4 mt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#d7551f] hover:bg-[#e8662f] px-4 py-2 text-white rounded "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
  );
};

export default ApplicationModal;