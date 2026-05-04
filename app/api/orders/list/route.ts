export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
const orders = await prisma.order.findMany({
include: {
region: true,
mosque: true,
},
orderBy: {
createdAt: "desc",
},
});

return Response.json(orders);
}
