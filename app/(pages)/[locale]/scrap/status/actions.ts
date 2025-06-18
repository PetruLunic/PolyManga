"use server"

import {ServerStatus} from "@/app/(pages)/[locale]/scrap/status/page";
import {auth} from "@/auth";

export async function fetchStatus(): Promise<ServerStatus | null> {
  const session = await auth();

  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    console.warn("Forbidden action: User does not have permission to save chapter titles.");
    throw new Error("Forbidden action");
  }

  try {
    const response = await fetch(`${process.env.SCRAP_SERVER_URL || 'http://localhost:4000'}/status`, {
      headers: {
        'x-api-key': process.env.SCRAP_API_SECRET_KEY || '',
      }
    });

    if (response.status !== 503 && !response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return null;
  }
}