import Link from "next/link";
import { PrismaClient } from "@prisma/client";

export const metadata = {
title: "سقاية - لوحة التحكم",
};

const prisma = new PrismaClient();

export default async function DashboardPage() {
const totalOrders = await prisma.order.count();

const paidOrders = await prisma.order.count({
where: { status: "PAID" },
});

const newOrders = await prisma.order.count({
where: { status: "NEW" },
});

const doneOrders = await prisma.order.count({
where: { status: "DONE" },
});

const estimatedProfit = paidOrders * 500;

const today = new Date().toLocaleDateString("ar-IQ");

return ( <main className="min-h-screen bg-gray-100 p-5 text-black">


  <div className="max-w-6xl mx-auto space-y-6">

    <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-3xl p-6 shadow-xl">

      <div className="flex justify-between items-start gap-4 flex-wrap">

        <div>
          <h1 className="text-3xl font-bold">
            لوحة التحكم
          </h1>

          <p className="mt-2 opacity-90">
            إدارة مشروع سقاية بسهولة واحترافية
          </p>

          <p className="text-sm mt-3 opacity-80">
            {today}
          </p>
        </div>

        <form action="/api/logout" method="post">
          <button
            className="bg-white text-blue-700 px-5 py-2 rounded-2xl font-bold shadow"
          >
            تسجيل الخروج
          </button>
        </form>

      </div>

    </div>

    {newOrders > 0 && (
      <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 font-bold">
        يوجد {newOrders} طلب جديد يحتاج المتابعة
      </div>
    )}

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-white rounded-3xl shadow p-5">
        <div className="text-sm text-gray-500">
          إجمالي الطلبات
        </div>

        <div className="text-3xl font-bold mt-2">
          {totalOrders}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5">
        <div className="text-sm text-gray-500">
          مدفوعة
        </div>

        <div className="text-3xl font-bold text-purple-700 mt-2">
          {paidOrders}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5">
        <div className="text-sm text-gray-500">
          مكتملة
        </div>

        <div className="text-3xl font-bold text-green-700 mt-2">
          {doneOrders}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5">
        <div className="text-sm text-gray-500">
          أرباح تقديرية
        </div>

        <div className="text-2xl font-bold text-emerald-700 mt-2">
          {estimatedProfit.toLocaleString()} د.ع
        </div>
      </div>

    </div>

    <div className="grid md:grid-cols-2 gap-5">

      <Link
        href="/admin"
        className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"
      >
        <div className="text-2xl mb-2">🧾</div>
        <div className="font-bold text-lg">
          إدارة الطلبات
        </div>
        <div className="text-sm text-gray-500 mt-1">
          متابعة الحالات
        </div>
      </Link>

      <Link
        href="/finance"
        className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"
      >
        <div className="text-2xl mb-2">💰</div>
        <div className="font-bold text-lg">
          المالية
        </div>
        <div className="text-sm text-gray-500 mt-1">
          الإيرادات والأرباح
        </div>
      </Link>

      <Link
        href="/settings"
        className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"
      >
        <div className="text-2xl mb-2">⚙️</div>
        <div className="font-bold text-lg">
          الإعدادات
        </div>
        <div className="text-sm text-gray-500 mt-1">
          الأسعار والنسب
        </div>
      </Link>

      <Link
        href="/places"
        className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"
      >
        <div className="text-2xl mb-2">📍</div>
        <div className="font-bold text-lg">
          المناطق والمساجد
        </div>
        <div className="text-sm text-gray-500 mt-1">
          إدارة البيانات
        </div>
      </Link>

    </div>

  </div>

</main>


);
}
