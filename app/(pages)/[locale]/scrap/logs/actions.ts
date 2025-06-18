'use server';

import { LogFile, LogResponse, LogStats } from "@/app/types/logs";
import {auth} from "@/auth";

const SCRAPING_SERVICE_URL = process.env.SCRAP_SERVER_URL || 'http://localhost:4000';
const SCRAPING_API_KEY = process.env.SCRAP_API_SECRET_KEY || '';

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getLogFiles(): Promise<ActionResult<{ files: LogFile[]; totalFiles: number }>> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  try {
    const response = await fetch(`${SCRAPING_SERVICE_URL}/logs/list`, {
      headers: {
        'x-api-key': SCRAPING_API_KEY,
      },
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch log files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch log files'
    };
  }
}

export async function getLogContent(
  date: string,
  filters?: {
    search?: string;
    level?: string;
    lines?: string;
  }
): Promise<ActionResult<LogResponse>> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  try {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level && filters.level !== 'all') params.append('level', filters.level);
    if (filters?.lines && filters.lines !== 'all') params.append('lines', filters.lines);

    const url = `${SCRAPING_SERVICE_URL}/logs/file/${date}${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'x-api-key': SCRAPING_API_KEY,
      },
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch log content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch log content'
    };
  }
}

export async function getRecentLogs(
  lines: number = 100,
  level?: string
): Promise<ActionResult<{ logs: any[]; date: string }>> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  try {
    const params = new URLSearchParams();
    params.append('lines', lines.toString());
    if (level && level !== 'all') params.append('level', level);

    const response = await fetch(`${SCRAPING_SERVICE_URL}/logs/recent?${params}`, {
      headers: {
        'x-api-key': SCRAPING_API_KEY,
      },
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch recent logs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch recent logs'
    };
  }
}

export async function getLogStats(date?: string): Promise<ActionResult<LogStats>> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const response = await fetch(`${SCRAPING_SERVICE_URL}/logs/stats${params.toString() ? `?${params}` : ''}`, {
      headers: {
        'x-api-key': SCRAPING_API_KEY,
      },
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Failed to fetch log stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch log stats'
    };
  }
}

export async function getLogDownloadUrl(date: string): Promise<ActionResult<string>> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  try {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Return the download URL for client-side download
    const downloadUrl = `${SCRAPING_SERVICE_URL}/logs/download/${date}`;

    return {
      success: true,
      data: downloadUrl
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate download URL'
    };
  }
}
