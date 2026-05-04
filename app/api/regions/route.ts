export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
if (process.env.VERCEL_ENV === "production") {
return NextResponse.json([]);
}

try {
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const regions = await prisma.region.findMany({
  orderBy: { name: "asc" },
});

return NextResponse.json(regions);


} catch (error) {
console.error(error);
return NextResponse.json([]);
}
}
