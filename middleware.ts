import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
const protectedPaths = [
"/dashboard",
"/admin",
"/finance",
"/settings",
"/places",
];

const isProtected = protectedPaths.some((path) =>
req.nextUrl.pathname.startsWith(path)
);

const auth = req.cookies.get("admin_auth")?.value;

if (isProtected && !auth) {
return NextResponse.redirect(new URL("/login", req.url));
}

return NextResponse.next();
}

export const config = {
matcher: [
"/dashboard/:path*",
"/admin/:path*",
"/finance/:path*",
"/settings/:path*",
"/places/:path*",
],
};
