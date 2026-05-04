export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
// 👇 أثناء البناء لا نشغل Prisma نهائيًا
if (process.env.VERCEL_ENV === "production") {
return NextResponse.json([]);
}
    try {
const orders = await prisma.order.findMany({
include: {
region: true,
mosque: true,
},
orderBy: {
id: "desc",
},
});


return Response.json(orders);


} catch (error) {
console.error(error);
return Response.json([]);
}
}
