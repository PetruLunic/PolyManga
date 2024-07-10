import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/lib/utils/getSession";

// Paths allowed to moderators
const moderatorPaths = [
  "/manga/:id/upload",
  "/manga/create",
  "/manga/:id/edit"
];

const adminPaths = [
    "/admin"
];

// Function to convert path array to regex array
const convertPathToRegex = (path: string) => {
  const regexString = path.replace(/:\w+/g, '[^/]+'); // Replace :path with a regex to match any segment
  return new RegExp(`^${regexString}$`);
};

const convertPathsToRegex = (paths: string[]) => paths.map(convertPathToRegex);

const moderatorRegexes = convertPathsToRegex(moderatorPaths);
const adminRegexes = convertPathsToRegex(adminPaths);

export default async function middleware(req: NextRequest) {
  const forbiddenUrl = new URL('/forbidden', req.url).toString();
  const unauthorizedUrl = new URL('/unauthorized', req.url).toString();
  const path = req.nextUrl.pathname;
  const session = await getSession(req);

  const isPathMatched = (regexArray: RegExp[]) => regexArray.some(regex => regex.test(path));

  if (!session) {
    return NextResponse.rewrite(unauthorizedUrl);
  }

  switch(session.role) {
    case "MODERATOR":
      if (isPathMatched(adminRegexes)) {
        return NextResponse.rewrite(forbiddenUrl);
      }
      break;

    case "USER":
      if (isPathMatched(adminRegexes) || isPathMatched(moderatorRegexes)) {
        return NextResponse.rewrite(forbiddenUrl);
      }
  }
}

export const config = {
  matcher: [
    "/user/:id/(.+)",
    "/manga/:id/upload",
    "/manga/create",
    "/manga/:id/edit",
    "/admin"
  ]
}