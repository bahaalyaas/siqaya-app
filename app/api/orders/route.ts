export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
try {
const data = await req.json();


if (
  !data.name ||
  !data.phone ||
  !data.regionId ||
  !data.mosqueId ||
  !data.quantity
) {
  return new Response(
    JSON.stringify({
      success: false,
      message: "يرجى ملء جميع الحقول",
    }),
    { status: 400 }
  );
}

const order = await prisma.order.create({
  data: {
    name: data.name,
    phone: data.phone,
    regionId: Number(data.regionId),
    mosqueId: Number(data.mosqueId),
    quantity: Number(data.quantity),
    code: "ORD-" + Date.now(),
  } as any,
});

return new Response(
  JSON.stringify({
    success: true,
    code: order.code,
  }),
  { status: 200 }
);


} catch (error) {
console.error("SERVER ERROR:", error);


return new Response(
  JSON.stringify({
    success: false,
    message: "خطأ في السيرفر",
  }),
  { status: 500 }
);


}
}
