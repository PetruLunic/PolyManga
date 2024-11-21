import {NextRequest} from "next/server";
import {UserSession} from "@/app/types";
import {getToken} from "@auth/core/jwt";


export async function getSession(req: NextRequest): Promise<UserSession | null> {
  if (!process.env.AUTH_SECRET) {
    throw new Error("Auth secret not provided in .env file.");
  }

  let jwt = await getToken({req, secret: process.env.AUTH_SECRET!, salt: "authjs.session-token"});

  // If no jwt in authjs.session-token then try to access secure auth cookie
  if (!jwt) {
    jwt = await getToken({req, secret: process.env.AUTH_SECRET!, salt: "__Secure-authjs.session-token"});
  }

  return jwt as unknown as UserSession;
}