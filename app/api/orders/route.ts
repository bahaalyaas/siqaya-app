export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
const nodemailer = require("nodemailer");


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
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}

const region = await prisma.region.findUnique({
  where: { id: data.regionId },
});

const mosque = await prisma.mosque.findUnique({
  where: { id: data.mosqueId },
});

if (!region || !mosque) {
  return new Response(
    JSON.stringify({
      success: false,
      message: "بيانات المنطقة أو المسجد غير صحيحة",
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}

const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const countToday = await prisma.order.count({
  where: {
    createdAt: {
      gte: startOfDay,
    },
  },
});

const sequence = String(countToday + 1).padStart(3, "0");

const orderCode = `${day}${month}-${region.code}-${mosque.code}-${sequence}`;

const order = await prisma.order.create({
  data: {
    code: orderCode,
    name: data.name,
    phone: data.phone,
    regionId: data.regionId,
    mosqueId: data.mosqueId,
    quantity: parseInt(data.quantity),
  },
});

try {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `طلب جديد - سقاية (${order.code})`,
    text: `


طلب جديد وصل الآن

رقم الطلب: ${order.code}
الاسم: ${data.name}
الهاتف: ${data.phone}
المنطقة: ${region.name}
المسجد: ${mosque.name}
الكمية: ${data.quantity}
`,
});
} catch (mailError) {
console.error("MAIL ERROR:", mailError);
}


return new Response(
  JSON.stringify({
    success: true,
    orderId: order.code,
  }),
  {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }
);


} catch (error) {
console.error("SERVER ERROR:", error);


return new Response(
  JSON.stringify({
    success: false,
    message: "حدث خطأ في الخادم",
  }),
  {
    status: 500,
    headers: { "Content-Type": "application/json" },
  }
);


}
}
