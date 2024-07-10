// context/AlertContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import {nanoid} from "nanoid";
import {FiInfo} from "react-icons/fi";

interface Alert {
  message: string;
  type?: 'success' | 'danger' | 'info' | 'warning';
  delay?: number;
  id?: string;
}

interface AlertContextType {
  addAlert: (alert: Omit<Alert, "id">) => void
}

const AlertContext = createContext<AlertContextType | null>(null);

const AlertWrapper = styled.div<{ placement: string }>`
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  ${({ placement }) => placement === 'top' && 'top: 10px;'}
  ${({ placement }) => placement === 'bottom' && 'bottom: 10px;'}
  ${({ placement }) => placement === 'right-top' && 'top: 10px; right: 10px; align-items: flex-end;'}
  ${({ placement }) => placement === 'right-bottom' && 'bottom: 10px; right: 10px; align-items: flex-end;'}
  ${({ placement }) => placement === 'left-top' && 'top: 10px; left: 10px; align-items: flex-start;'}
  ${({ placement }) => placement === 'left-bottom' && 'bottom: 10px; left: 10px; align-items: flex-start;'}
`;

const getAlertColor = (type: string) => {
  switch(type) {
    case "info":
      return "text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-gray-800";
    case "danger":
      return "text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800";
    case "success":
      return "text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800";
    case "warning":
      return "text-yellow-800 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800";
  }
}

const AlertBox = styled(motion.div)<{ small: boolean;}>`
  padding: ${({ small }) => (small ? '4px 6px' : '10px 12px')};
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 4px;
  font-size: ${({ small }) => (small ? '10px' : '14px')};
`;

const animations = {
  initial: { opacity: 0, scale: 0.8, y: -50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 50 },
};

const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const addAlert = (alert: Alert) => {
    const id = nanoid();

    setAlerts(prevAlerts => [...prevAlerts, {id, ...alert}]);

    // Deleting alert after set delay or default 5000 ms
    setTimeout(() => {
      removeAlert(id);
    }, alert.delay || 5000)
  };

  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
      <AlertContext.Provider value={{addAlert}}>
        {children}
        <AlertWrapper placement="top">
          <AnimatePresence>
            {alerts.map((alert, index) => (
                <AlertBox
                    key={alert.id}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animations}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className={getAlertColor(alert.type || "info")}
                    small={alerts.length > 3 && index !== alerts.length - 1}
                >
                  <span className="flex items-center gap-2">
                    <FiInfo /> {alert.message}
                  </span>
                </AlertBox>
            ))}
          </AnimatePresence>
        </AlertWrapper>
      </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};

export { AlertProvider, useAlert };
