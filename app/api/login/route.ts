import { NextResponse } from "next/server";

export async function POST(req: Request) {
const data = await req.json();

if (data.password === process.env.ADMIN_PASSWORD) {
const response = NextResponse.json({
success: true,
});


response.cookies.set("admin_auth", "yes", {
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;


}

return NextResponse.json({
success: false,
});
}
