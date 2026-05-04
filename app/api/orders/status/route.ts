export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
try {
const { id, status } = await req.json();


await prisma.order.update({
  where: { id },
  data: { status },
});

return Response.json({ success: true });


} catch (error) {
console.error(error);
return Response.json({ success: false });
}
}
