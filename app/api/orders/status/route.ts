import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
try {
const data = await req.json();


await prisma.order.update({
  where: {
    id: data.id,
  },
  data: {
    status: data.status,
  },
});

return new Response(
  JSON.stringify({ success: true }),
  {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }
);


} catch (error) {
return new Response(
JSON.stringify({ success: false }),
{
status: 500,
headers: { "Content-Type": "application/json" },
}
);
}
}
