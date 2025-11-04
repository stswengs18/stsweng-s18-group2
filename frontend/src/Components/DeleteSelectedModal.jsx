import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClientEntry from "./ClientEntry"; // import your component

export default function DeleteSelectedModal({
  isOpen,
  onClose,
  onConfirm,
  selectedClientIds = [],
  allCases = [],
  setSelectedClients, // pass setter from parent to update selection
}) {
  const [modalSelectedClients, setModalSelectedClients] = useState([]);
  const [modalClients, setModalClients] = useState([]);

  useEffect(() => {
  if (isOpen) {
    setModalClients(allCases.filter((c) => selectedClientIds.includes(c.id)));
  }
  }, [isOpen, allCases, selectedClientIds]); // set once on open

  useEffect(() => {
    if (isOpen) {
      setModalSelectedClients(selectedClientIds);
    }
  }, [selectedClientIds, isOpen]);

  const handleSelectChange = (id, checked) => {
    if (checked) {
      setModalSelectedClients((prev) => [...prev, id]);
    } else {
      setModalSelectedClients((prev) => prev.filter((c) => c !== id));
    }
  };

  const handleConfirm = () => {
    onConfirm(modalSelectedClients);
  };

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

            <div className="flex flex-col justify-between flex-1 p-6">
              <p className="font-label mb-4">
                You are about to delete the following {modalSelectedClients.length} case(s). This action cannot be undone.
              </p>

              <div className="max-h-96 overflow-y-auto border rounded p-3 mb-6 flex flex-col gap-2">
                {modalClients.length > 0 ? (
                  modalClients.map((client) => (
                    <ClientEntry
                      key={client.id}
                      id={client.id}
                      name={client.name}
                      sm_number={client.sm_number}
                      spu={client.spu}
                      assigned_sdw_name={client.assigned_sdw_name}
                      archive={true}
                      showCheckbox={true}
                      isSelected={modalSelectedClients.includes(client.id)}
                      onSelectChange={handleSelectChange}
                      deleteMode={true}
                    />
                  ))
                ) : (
                  <p className="font-label text-gray-600 text-center">
                    No clients selected.
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-6">
                <button
                  className="btn-outline font-bold-label"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary font-bold-label"
                  onClick={handleConfirm}
                  disabled={modalSelectedClients.length === 0} // disable confirm if no clients
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
