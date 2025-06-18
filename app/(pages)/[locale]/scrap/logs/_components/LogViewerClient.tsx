'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination
} from "@heroui/react";
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaInfoCircle,
  FaBug,
  FaCheckCircle,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import {MdError, MdRefresh, MdWarning} from "react-icons/md";
import { LogResponse, LogEntry } from "@/app/types/logs";
import { useState, useMemo } from "react";
import { getLogContent } from "../actions";

const LOG_LEVELS = [
  { key: 'all', label: 'All Levels' },
  { key: 'error', label: 'Error' },
  { key: 'warn', label: 'Warning' },
  { key: 'info', label: 'Info' },
  { key: 'debug', label: 'Debug' }
];

const LINES_OPTIONS = [
  { key: '50', label: '50 lines' },
  { key: '100', label: '100 lines' },
  { key: '500', label: '500 lines' },
  { key: '1000', label: '1000 lines' },
  { key: 'all', label: 'All lines' }
];

const SORT_OPTIONS = [
  { key: 'desc', label: 'Newest First', icon: FaSortAmountDown },
  { key: 'asc', label: 'Oldest First', icon: FaSortAmountUp },
];

function LogLevelIcon({ level }: { level: string }) {
  switch (level.toLowerCase()) {
    case 'error':
      return <MdError className="w-4 h-4 text-danger" />;
    case 'warn':
      return <MdWarning className="w-4 h-4 text-warning" />;
    case 'info':
      return <FaInfoCircle className="w-4 h-4 text-primary" />;
    case 'debug':
      return <FaBug className="w-4 h-4 text-secondary" />;
    default:
      return <FaCheckCircle className="w-4 h-4 text-success" />;
  }
}

function LogLevelChip({ level }: { level: string }) {
  const colorMap: Record<string, any> = {
    error: 'danger',
    warn: 'warning',
    info: 'primary',
    debug: 'secondary'
  };

  return (
    <Chip
      size="sm"
      color={colorMap[level.toLowerCase()] || 'default'}
      variant="flat"
      startContent={<LogLevelIcon level={level} />}
    >
      {level.toUpperCase()}
    </Chip>
  );
}

function LogEntryCard({ entry, index }: { entry: LogEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card isBlurred className="mb-2">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <LogLevelChip level={entry.level} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="w-3 h-3 text-default-400" />
              <span className="text-xs font-mono text-default-600">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              <span className="text-xs text-default-400">#{index + 1}</span>
            </div>
            <p className="text-sm mb-2 break-words">{entry.message}</p>

            {Object.keys(entry).length > 3 && (
              <Button
                size="sm"
                variant="light"
                color="primary"
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? 'Hide Details' : 'Show Details'}
              </Button>
            )}

            {expanded && (
              <div className="mt-3 p-3 bg-default-100 rounded-lg">
                <pre className="text-xs text-default-700 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(entry, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

interface LogViewerClientProps {
  initialData: LogResponse;
  date: string;
}

export function LogViewerClient({ initialData, date }: LogViewerClientProps) {
  const [logs, setLogs] = useState<LogResponse>(initialData);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [lines, setLines] = useState('100');
  const [sortOrder, setSortOrder] = useState('desc'); // New sort state

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  // Memoized sorted logs
  const sortedLogs = useMemo(() => {
    const logsToSort = [...logs.logs];

    return logsToSort.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      if (sortOrder === 'asc') {
        return dateA - dateB; // Oldest first
      } else {
        return dateB - dateA; // Newest first
      }
    });
  }, [logs.logs, sortOrder]);

  const fetchLogs = async () => {
    setLoading(true);

    try {
      const filters = {
        search: search || undefined,
        level: level !== 'all' ? level : undefined,
        lines: lines !== 'all' ? lines : undefined,
      };

      const result = await getLogContent(date, filters);

      if (result.success && result.data) {
        setLogs(result.data);
        setCurrentPage(1); // Reset to first page
      } else {
        alert(result.error || 'Failed to load logs');
      }
    } catch (error) {
      alert('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Pagination with sorted logs
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const currentLogs = sortedLogs.slice(startIndex, endIndex);

  // Get current sort option for display
  const currentSortOption = SORT_OPTIONS.find(option => option.key === sortOrder);
  const SortIcon = currentSortOption?.icon || FaSortAmountDown;

  return (
    <>
      {/* Filters */}
      <Card isBlurred className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaFilter className="w-5 h-5 text-primary" />
            Filters & Sorting
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search logs..."
              startContent={<FaSearch className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchLogs();
                }
              }}
            />
            <Select
              label="Log Level"
              selectedKeys={[level]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setLevel(selected);
              }}
            >
              {LOG_LEVELS.map((levelOption) => (
                <SelectItem key={levelOption.key}>
                  {levelOption.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Lines Limit"
              selectedKeys={[lines]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setLines(selected);
              }}
            >
              {LINES_OPTIONS.map((lineOption) => (
                <SelectItem key={lineOption.key}>
                  {lineOption.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Sort by Time"
              selectedKeys={[sortOrder]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleSortChange(selected);
              }}
              startContent={<SortIcon className="w-4 h-4" />}
            >
              {SORT_OPTIONS.map((sortOption) => {
                const IconComponent = sortOption.icon;
                return (
                  <SelectItem
                    key={sortOption.key}
                    startContent={<IconComponent className="w-4 h-4" />}
                  >
                    {sortOption.label}
                  </SelectItem>
                );
              })}
            </Select>
            <Button
              color="primary"
              onPress={fetchLogs}
              isLoading={loading}
            >
              Apply Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {sortedLogs.length > 0 && (
        <Card isBlurred className="mb-4">
          <CardBody className="py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4 text-primary" />
                <span className="font-medium">Time Range:</span>
                <span className="font-mono">
            {new Date(sortedLogs[sortedLogs.length - 1]?.timestamp).toLocaleString()}
          </span>
                <span className="text-default-400">→</span>
                <span className="font-mono">
            {new Date(sortedLogs[0]?.timestamp).toLocaleString()}
          </span>
              </div>
              <Chip size="sm" variant="flat" color="primary">
                {sortedLogs.length} entries
              </Chip>
            </div>
          </CardBody>
        </Card>
      )}


      {/* Log Entries */}
      <Card isBlurred>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaClock className="w-5 h-5 text-primary" />
              Log Entries
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-default-600">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedLogs.length)} of {sortedLogs.length}
              </span>
              <Button
                size="sm"
                variant="light"
                startContent={<MdRefresh className="w-3 h-3" />}
                onPress={fetchLogs}
                isLoading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-8">
              <FaSearch className="w-12 h-12 text-default-300 mx-auto mb-4" />
              <p className="text-default-600">No log entries found with current filters</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {currentLogs.map((entry, index) => (
                  <LogEntryCard
                    key={`${entry.timestamp}-${startIndex + index}`}
                    entry={entry}
                    index={startIndex + index}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}
