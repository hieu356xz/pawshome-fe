import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// This is the "proxy" that Next.js 16 uses instead of middleware
const middleware = createMiddleware(routing);

export const proxy = middleware;
export default middleware;

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*", "/((?!_next|api|favicon.ico).*)"],
};
