import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NoSelectionModal({ isOpen, onClose }) {
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

          <div className="relative bg-white rounded-lg drop-shadow-card max-w-[40rem] w-full min-h-[16rem] z-10 overflow-hidden flex flex-col">
            <div className="w-full p-5 drop-shadow-base" style={{ backgroundColor: "var(--accent-white)" }}>
              <h2 className="header-sub">No Clients Selected</h2>
            </div>

            <div className="flex flex-col justify-between flex-1 p-10">
              <p className="font-label my-6">
                You haven't selected any cases to delete. Please check the boxes of the cases you want to remove, then try again.
              </p>

              <div className="flex justify-center">
                <button
                  className="btn-outline font-bold-label"
                  onClick={() => {
                    onClose?.();
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}