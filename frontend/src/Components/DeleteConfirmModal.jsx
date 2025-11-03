import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedClientIds = [],
  allCases = [],
}) {
  const selectedClientsData = allCases.filter((c) => selectedClientIds.includes(c.id));
  const previewList = selectedClientsData.slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-99"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

          <div className="relative bg-white rounded-lg drop-shadow-card max-w-[60rem] w-full min-h-[18rem] z-10 overflow-hidden flex flex-col">
            <div className="w-full p-5 drop-shadow-base" style={{ backgroundColor: "var(--accent-white)" }}>
              <h2 className="header-sub">Confirm Deletion</h2>
            </div>

            <div className="flex flex-col justify-between flex-1 p-10">
              <p className="font-label mb-4">
                You are about to delete the following {selectedClientIds.length} case(s). This action cannot be undone.
              </p>

              <div className="max-h-44 overflow-y-auto border rounded p-3 mb-6">
                {previewList.map((c) => (
                  <div key={c.id} className="py-2 border-b last:border-b-0">
                    <p className="font-bold-label">{c.name}</p>
                    <p className="font-label text-sm">CH Number: {c.sm_number}</p>
                  </div>
                ))}
                {selectedClientsData.length > previewList.length && (
                  <p className="font-label mt-2">...and {selectedClientsData.length - previewList.length} more</p>
                )}
                {selectedClientsData.length === 0 && (
                  <p className="font-label text-gray-600">No client data available.</p>
                )}
              </div>

              <div className="flex justify-center gap-6">
                <button
                  className="btn-outline font-bold-label"
                  onClick={() => {
                    onClose?.();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary font-bold-label"
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}