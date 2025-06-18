export interface LogFile {
  name: string;
  date: string;
  size: number;
  compressed: boolean;
  lastModified: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: any;
}

export interface LogResponse {
  date: string;
  file: string;
  compressed: boolean;
  totalLines: number;
  filteredLines: number;
  filters: {
    search: string | null;
    level: string | null;
    lines: number | null;
  };
  logs: LogEntry[];
}

export interface LogStats {
  date?: string;
  totalLines: number;
  levels: Record<string, number>;
  errors: number;
  warnings: number;
  scrapingEvents: number;
  timeRange: {
    start: string | null;
    end: string | null;
  };
}
