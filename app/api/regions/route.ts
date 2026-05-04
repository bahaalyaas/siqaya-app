export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
// 👇 أثناء البناء لا نشغل Prisma نهائيًا
if (process.env.VERCEL_ENV === "production") {
return NextResponse.json([]);
}
  try {
const regions = await prisma.region.findMany({
orderBy: { name: "asc" },
});


return Response.json(regions);


} catch (error) {
console.error(error);
return Response.json([]);
}
}
