import {NextRequest} from "next/server";
import {UserSession} from "@/app/types";
import {getToken} from "@auth/core/jwt";


export async function getSession(req: NextRequest): Promise<UserSession | null> {
  if (!process.env.AUTH_SECRET) {
    throw new Error("Auth secret not provided in .env file.");
  }

  // Determine the session cookie name dynamically
  const cookies = req.cookies;
  const possibleCookieNames = [
    "_vercel_jwt", // Cookie used in Vercel environment
    "__Secure-authjs.session-token", // Secure cookie for production
    "authjs.session-token", // Default cookie for local development
  ];

  // Find the cookie that exists in the request
  const cookieName = possibleCookieNames.find((name) => cookies.get(name));
  if (!cookieName) {
    console.warn("No valid session cookie found.");
    return null; // No session cookie found
  }

  // Use the cookieName as the salt
  const salt = cookieName;

  // Try to retrieve the token
  let jwt = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
    cookieName,
    salt, // Pass the detected cookie name as the salt
  });

  return jwt as unknown as UserSession;
}