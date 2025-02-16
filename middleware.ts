import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/lib/utils/getSession";
import createMiddleware from "next-intl/middleware";
import {locales, routing} from "@/i18n/routing";

// Paths allowed to moderators
const moderatorPaths = [
  "/(.+)/manga/:id/upload",
  "/(.+)/manga/create",
  "/(.+)/manga/:id/edit"
];

const adminPaths = [
    "/(.+)/admin"
];

// Function to convert path array to regex array
const convertPathToRegex = (path: string) => {
  const regexString = path.replace(/:\w+/g, '[^/]+'); // Replace :path with a regex to match any segment
  return new RegExp(`^${regexString}$`);
};

const convertPathsToRegex = (paths: string[]) => paths.map(convertPathToRegex);

const moderatorRegexes = convertPathsToRegex(moderatorPaths);
const adminRegexes = convertPathsToRegex(adminPaths);

const basePaths = ["manga", "user", "unauthorized", "forbidden"] as const;

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const forbiddenUrl = new URL('/forbidden', req.url).toString();
  const unauthorizedUrl = new URL('/unauthorized', req.url).toString();
  const path = req.nextUrl.pathname;
  const session = await getSession(req);

  // Handle i18n routes first
  const handleI18n = intlMiddleware(req);

  // Check if pathname matches any locale
  const pathnameHasLocale = locales.some(
    locale => path.startsWith(`/${locale}/`) || path === `/${locale}`
  );

  // If no valid locale is found in the pathname, redirect to default locale
  if (!pathnameHasLocale && path !== '/') {
    // If path starts with basic paths, then prepend the locale to the path, otherwise replace it
    if (basePaths.some(basePath => path.startsWith(`/${basePath}/`) || path === `/${basePath}`)) {
      req.nextUrl.pathname = `/en${path}`;
    } else {
      req.nextUrl.pathname = `/en/${path.slice(1).split("/").slice(1).join("/")}`;
    }

    return NextResponse.redirect(req.nextUrl);
  }

  const isPathMatched = (regexArray: RegExp[]) => regexArray.some(regex => regex.test(path));

  // if (!session) {
  //   return NextResponse.rewrite(unauthorizedUrl);
  // }

  switch(session?.role) {
    case "MODERATOR":
      if (isPathMatched(adminRegexes)) {
        return NextResponse.rewrite(forbiddenUrl);
      }
      break;

    case "USER":
      if (isPathMatched(adminRegexes) || isPathMatched(moderatorRegexes)) {
        return NextResponse.rewrite(forbiddenUrl);
      }
      break;
  }

  return handleI18n;
}

export const config = {
  matcher: [
    "/user/:id/(.+)",
    "/manga/:id/upload",
    "/manga/create",
    "/manga/:id/edit",
    "/admin",
    '/((?!api|_next|.*\\.).*)'
  ]
}