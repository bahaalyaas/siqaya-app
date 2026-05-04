export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
// 👇 أثناء البناء لا نشغل Prisma نهائيًا
if (process.env.VERCEL_ENV === "production") {
return NextResponse.json([]);
}

try {
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const mosques = await prisma.mosque.findMany({
  include: { region: true },
});

return NextResponse.json(mosques);


} catch (error) {
console.error(error);
return NextResponse.json([]);
}
}
