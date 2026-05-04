export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { id, status } = await req.json();


const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

await prisma.order.update({
  where: { id },
  data: { status },
});

return NextResponse.json({ success: true });


} catch (error) {
console.error(error);
return NextResponse.json({ success: false });
}
}
