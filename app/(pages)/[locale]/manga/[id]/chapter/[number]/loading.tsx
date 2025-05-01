import {Spinner} from "@heroui/react";

export default function Loading() {

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
      <Spinner size="lg"/>
    </div>
  );
};