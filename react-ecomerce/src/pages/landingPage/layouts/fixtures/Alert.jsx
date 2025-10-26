import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function Alert({ message, type = "warning", show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const icon = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
    error: <XCircleIcon className="w-6 h-6 text-red-600" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />,
  }[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="fixed top-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg dark:bg-gray-900 dark:text-gray-100"
        >
          {icon}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
