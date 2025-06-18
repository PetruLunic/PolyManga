'use client';

import { Button } from "@heroui/react";
import {FaArrowLeft} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import {Link} from "@/i18n/routing";

export function RefreshButton() {
  return (
    <Button
      color="primary"
      variant="light"
      startContent={<MdRefresh className="w-4 h-4" />}
      onPress={() => window.location.reload()}
    >
      Refresh
    </Button>
  );
}

export function ViewErrorsButton() {
  return (
    <Button
      as={Link}
      href={`/scrap/logs/${new Date().toISOString().split('T')[0]}?level=error`}
      color="warning"
      size="sm"
    >
      View Errors
    </Button>
  );
}

export function ViewTodayLogsButton() {
  return (
    <Button
      as={Link}
      href={`/scrap/logs/${new Date().toISOString().split('T')[0]}`}
      color="primary"
      size="sm"
    >
      View Today
    </Button>
  );
}

export function BackToLogsButton() {
  return (
    <Button
      as={Link}
      href="/scrap/logs"
      variant="light"
      startContent={<FaArrowLeft className="w-4 h-4" />}
    >
      Back to Logs
    </Button>
  );
}