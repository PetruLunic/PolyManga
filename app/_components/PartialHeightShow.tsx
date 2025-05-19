"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@heroui/react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  initialHeight: string; // e.g., "200px", "10rem", "30vh"
}

export default function PartialHeightShow ({children, initialHeight, ...props}: Props) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className={`relative ${props.className}`} {...props}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: expanded ? contentHeight ?? "none" : initialHeight,
        }}
      >
        {children}
      </div>

      {/* Show button only if content is taller than initialHeight */}
      {contentHeight !== null && contentHeight > parseInt(initialHeight) && (
        <Button
          onPress={toggleExpanded}
          className="mt-2"
          variant="light"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};