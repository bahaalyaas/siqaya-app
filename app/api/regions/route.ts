export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const regions = await prisma.region.findMany();

  return new Response(JSON.stringify(regions), {
    headers: { "Content-Type": "application/json" },
  });
}