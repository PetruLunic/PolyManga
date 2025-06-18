"use client"

import {Link} from "@/i18n/routing";
import {Button} from "@heroui/react";
import { TbLogs } from "react-icons/tb";

export function LogsLink() {
  return <Button
    as={Link}
    startContent={<TbLogs />}
    href={`/scrap/logs`}
    color="primary"
  >
    View Logs
  </Button>
}