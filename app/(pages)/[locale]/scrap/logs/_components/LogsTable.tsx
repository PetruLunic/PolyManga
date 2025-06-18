'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button
} from "@heroui/react";
import { LogFile } from "@/app/types/logs";
import {FaArchive, FaCalendarAlt, FaEye, FaFileAlt} from "react-icons/fa";
import {Link} from "@/i18n/routing";

interface LogsTableProps {
  files: LogFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function LogsTable({ files }: LogsTableProps) {
  return (
    <Table aria-label="Log files table">
      <TableHeader>
        <TableColumn>DATE</TableColumn>
        <TableColumn>FILE</TableColumn>
        <TableColumn>SIZE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>LAST MODIFIED</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.date}>
            <TableCell>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4 text-primary" />
                <span className="font-mono">{file.date}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {file.compressed ? (
                  <FaArchive className="w-4 h-4 text-warning" />
                ) : (
                  <FaFileAlt className="w-4 h-4 text-primary" />
                )}
                <span className="font-mono text-sm">{file.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{formatFileSize(file.size)}</span>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                color={file.compressed ? 'warning' : 'success'}
                variant="flat"
              >
                {file.compressed ? 'Compressed' : 'Active'}
              </Chip>
            </TableCell>
            <TableCell>
                        <span className="text-sm">
                          {new Date(file.lastModified).toLocaleString()}
                        </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  as={Link}
                  href={`/scrap/logs/${file.date}`}
                  size="sm"
                  color="primary"
                  variant="light"
                  startContent={<FaEye className="w-3 h-3" />}
                >
                  View
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
