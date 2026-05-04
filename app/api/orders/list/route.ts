export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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
