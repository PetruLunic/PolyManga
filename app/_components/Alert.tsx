import {Button} from "@heroui/react";
import {IoMdClose} from "react-icons/io";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

interface Props{
  title: string,
  description?: string,
  type?: "info" | "danger" | "success" | "warning",
  onDismiss?: () => void,
  isVisible?: boolean,
  timeOut?: number
}

const AlertTypeColor = {
  "info": "blue",
  "danger": "red",
  "success": "green",
  "warning": "yellow"
}

const getContainerClasses = (type: keyof typeof AlertTypeColor) => {
  switch(type) {
    case "info":
      return "text-blue-800 bg-blue-50 dark:text-blue-400";
    case "danger":
      return "text-red-800 bg-red-50 dark:text-red-400";
    case "success":
      return "text-green-800 bg-green-50 dark:text-green-400";
    case "warning":
      return "text-yellow-800 bg-yellow-50 dark:text-yellow-400";
  }
}

const getButtonClass = (type: keyof typeof AlertTypeColor) => {
  switch(type) {
    case "info":
      return "text-blue-500";
    case "danger":
      return "text-red-500";
    case "success":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
  }
}

export default function Alert({title, description, type = "info", onDismiss, isVisible = false, timeOut}: Props) {
  const [isVisibleState, setIsVisibleState] = useState<boolean>(false);

  useEffect(() => {
    if (!timeOut) return;

    const timeoutId = setTimeout(onDelete, timeOut);

    return () => {
      clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    setIsVisibleState(isVisible);
  }, [isVisible]);

  const onDelete = () => {
    setIsVisibleState(false);

    onDismiss && onDismiss();
  }

 return (
     <AnimatePresence>
       {isVisibleState
           &&  <motion.div
               key={description}
               className={`flex items-center p-3 mb-4 rounded-lg dark:bg-gray-800/25 ${getContainerClasses(type)}`}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               role="alert"
           >
               <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="sr-only">{title}</span>
               <div>
                   <div className="font-medium">{title}</div>
                  {description && <div className="text-sm">{description}</div>}
               </div>
               <Button
                   isIconOnly
                   radius="full"
                   variant="light"
                   onPress={onDelete}
                   className={`ms-auto -mx-1.5 -my-1.5 text-xl ${getButtonClass(type)}`}
               >
                   <IoMdClose />
               </Button>
           </motion.div>}
     </AnimatePresence>
 );
};