import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/lib/utils/getSession";
import createMiddleware from "next-intl/middleware";
import {locales, routing} from "@/i18n/routing";

const userPaths = [
  "/user/bookmarks",
  "/user/history",
  "/user/settings",
]

// Paths allowed to moderators
const moderatorPaths = [
  "/manga/:id/upload",
  "/manga/create",
  "/manga/:id/edit",
  "/manga/:id/edit/chapters",
  "/manga/:id/chapter/:number/edit"
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

const userRegexes = convertPathsToRegex(userPaths);
const moderatorRegexes = convertPathsToRegex(moderatorPaths);
const adminRegexes = convertPathsToRegex(adminPaths);

const basePaths = ["manga", "user", "unauthorized", "forbidden"] as const;

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
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

  const locale = path.slice(1).split("/")[0];

  // Part of authorization
  const pathWithNoLocale = `/${path.slice(1).split("/").slice(1).join("/")}`;
  const isPathMatched = (regexArray: RegExp[]) => regexArray.some(regex => regex.test(pathWithNoLocale));

  switch(session?.role) {
    case "MODERATOR":
      if (isPathMatched(adminRegexes)) {
        return NextResponse.rewrite(new URL(`/${locale}/not-found`, req.nextUrl));
      }
      break;

    case "USER":
    case undefined:
      if (isPathMatched([...adminRegexes, ...moderatorRegexes])) {
        return NextResponse.rewrite(new URL(`/${locale}/not-found`, req.nextUrl));
      }
      break;
  }

  // If isn't authorized at all then forbid the user's paths
  if (!session && isPathMatched(userRegexes)) {
    return NextResponse.redirect(unauthorizedUrl);
  }

  return handleI18n;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\.).*)'
  ]
}