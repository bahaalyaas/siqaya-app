import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
try {
const { searchParams } = new URL(req.url);
const regionId = searchParams.get("regionId");


const mosques = await prisma.mosque.findMany({
  where: {
    regionId: regionId || undefined,
  },
  orderBy: {
    name: "asc",
  },
});

return new Response(JSON.stringify(mosques), {
  headers: { "Content-Type": "application/json" },
});

} catch (error) {
return new Response(
JSON.stringify({ error: "Server error" }),
{
status: 500,
headers: { "Content-Type": "application/json" },
}
);
}
}
