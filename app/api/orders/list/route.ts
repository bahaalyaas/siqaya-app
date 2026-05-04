export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
if (process.env.VERCEL_ENV === "production") {
return NextResponse.json([]);
}

try {
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const orders = await prisma.order.findMany({
  include: {
    region: true,
    mosque: true,
  },
  orderBy: {
    id: "desc",
  },
});

return NextResponse.json(orders);


} catch (error) {
console.error(error);
return NextResponse.json([]);
}
}
