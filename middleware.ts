import { NextResponse } from "next/server";

export function middleware(req) {
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

const auth = req.cookies.get("admin_auth");

if (isProtected && !auth) {
return NextResponse.redirect(
new URL("/login", req.url)
);
}

return NextResponse.next();
}
