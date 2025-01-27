"use client"

import React, {forwardRef, useState} from 'react';
import {Input, Button, InputProps} from "@heroui/react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import { motion } from 'framer-motion';

export const InputPassword = forwardRef<HTMLInputElement, InputProps>(function InputPassword(props: InputProps, ref) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(prevVisible => !prevVisible);
  };

  return (
      <Input
          ref={ref}
          type={visible ? "text" : "password"}
          endContent={
            <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={toggleVisibility}
            >
              <motion.div
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: visible ? 0 : 180 }}
                  transition={{ duration: 0.1 }}
              >
              {visible
                  ? <FaRegEyeSlash className="text-xl text-default-400 pointer-events-none flex-shrink-0"/>
                  : <FaRegEye className="text-xl text-default-400 pointer-events-none flex-shrink-0"/>}
              </motion.div>
            </Button>
          }
          {...props}
      />
  );
});

export default InputPassword;