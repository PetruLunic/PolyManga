import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { FiInfo } from "react-icons/fi";

interface Alert {
  message: string;
  type?: "success" | "danger" | "info" | "warning";
  delay?: number;
  id?: string;
}

interface AlertContextType {
  addAlert: (alert: Omit<Alert, "id">) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

const getAlertColor = (type: string) => {
  switch (type) {
    case "info":
      return "text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-gray-800";
    case "danger":
      return "text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800";
    case "success":
      return "text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800";
    case "warning":
      return "text-yellow-800 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800";
    default:
      return "";
  }
};

const animations = {
  initial: { opacity: 0, scale: 0.8, y: -50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 50 },
};

const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, "id">) => {
    const id = nanoid();

    setAlerts((prevAlerts) => [...prevAlerts, { id, ...alert }]);

    // Remove alert after a set delay or default to 5000 ms
    setTimeout(() => {
      removeAlert(id);
    }, alert.delay || 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      <div
        className="fixed w-full flex flex-col items-center z-[1000] top-10"
        style={{ pointerEvents: "none" }} // Prevent interfering with other elements
      >
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animations}
              transition={{ duration: 0.5, type: "spring" }}
              className={`rounded-lg shadow-md mb-1 p-3 ${
                alerts.length > 3 && index !== alerts.length - 1 ? "text-sm py-2 px-3" : ""
              } ${getAlertColor(alert.type || "info")}`}
            >
              <span className="flex items-center gap-2">
                <FiInfo /> {alert.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  return context;
};

export { AlertProvider, useAlert };
