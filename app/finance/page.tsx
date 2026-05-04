import { PrismaClient } from "@prisma/client";

export const metadata = {
title: "سقاية - المالية",
};

const prisma = new PrismaClient();

export default async function FinancePage() {
const settings = await prisma.settings.findFirst();

const sellPrice = settings?.sellPrice || 2000;
const buyPrice = settings?.buyPrice || 1500;
const charityPercent = settings?.charityPercent || 10;

const profitPerBox = sellPrice - buyPrice;

const orders = await prisma.order.findMany({
include: {
mosque: true,
region: true,
},
orderBy: {
createdAt: "desc",
},
});

const paidOrders = orders.filter(
(o) => o.status === "PAID" || o.status === "DONE"
);

const now = new Date();

const isToday = (date) =>
new Date(date).toDateString() === now.toDateString();

const isThisMonth = (date) => {
const d = new Date(date);
return (
d.getMonth() === now.getMonth() &&
d.getFullYear() === now.getFullYear()
);
};

const isThisYear = (date) => {
const d = new Date(date);
return d.getFullYear() === now.getFullYear();
};

const calcBoxes = (list) =>
list.reduce((sum, item) => sum + Number(item.quantity), 0);

const calcFinance = (boxes) => {
const revenue = boxes * sellPrice;
const supplier = boxes * buyPrice;
const gross = boxes * profitPerBox;
const charity = gross * (charityPercent / 100);
const net = gross - charity;


return { revenue, supplier, gross, charity, net };


};

const totalBoxes = calcBoxes(paidOrders);
const totalStats = calcFinance(totalBoxes);

const todayStats = calcFinance(
calcBoxes(paidOrders.filter((o) => isToday(o.createdAt)))
);

const monthStats = calcFinance(
calcBoxes(paidOrders.filter((o) => isThisMonth(o.createdAt)))
);

const yearStats = calcFinance(
calcBoxes(paidOrders.filter((o) => isThisYear(o.createdAt)))
);

const mosques = await prisma.mosque.findMany({
include: {
region: true,
},
});

const last30 = new Date();
last30.setDate(last30.getDate() - 30);

const recentOrders = paidOrders.filter(
(o) => new Date(o.createdAt) >= last30
);

const mosqueNeeds = mosques
.map((mosque) => {
const related = recentOrders.filter(
(o) => o.mosqueId === mosque.id
);


  const boxes = related.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  let level = "🟢 جيد";

  if (boxes === 0) level = "🔴 أولوية عالية";
  else if (boxes <= 2) level = "🟠 يحتاج دعم";
  else if (boxes <= 5) level = "🟡 متوسط";

  return {
    id: mosque.id,
    name: mosque.name,
    region: mosque.region?.name,
    boxes,
    level,
  };
})
.sort((a, b) => a.boxes - b.boxes);


return ( <main className="min-h-screen bg-gray-100 p-4 text-black">


  <div className="max-w-7xl mx-auto">

    <h1 className="text-2xl font-bold mb-4">
      الصفحة المالية
    </h1>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 text-sm">

      <div className="bg-white p-4 rounded-2xl shadow">
        📦 الصناديق: {totalBoxes}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        💰 الإيرادات: {totalStats.revenue.toLocaleString()}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        🚚 المجهز: {totalStats.supplier.toLocaleString()}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        🤲 الصدقة: {totalStats.charity.toLocaleString()}
      </div>

      <div className="bg-green-100 p-4 rounded-2xl shadow font-bold">
        🟢 الصافي: {totalStats.net.toLocaleString()}
      </div>

    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold mb-2">📅 اليوم</h2>
        <div>💰 الإيراد: {todayStats.revenue.toLocaleString()}</div>
        <div>📈 الربح: {todayStats.gross.toLocaleString()}</div>
        <div>🤲 الصدقة: {todayStats.charity.toLocaleString()}</div>
        <div className="font-bold text-green-700">
          🟢 الصافي: {todayStats.net.toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold mb-2">📆 هذا الشهر</h2>
        <div>💰 الإيراد: {monthStats.revenue.toLocaleString()}</div>
        <div>📈 الربح: {monthStats.gross.toLocaleString()}</div>
        <div>🤲 الصدقة: {monthStats.charity.toLocaleString()}</div>
        <div className="font-bold text-green-700">
          🟢 الصافي: {monthStats.net.toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold mb-2">🗓️ هذا العام</h2>
        <div>💰 الإيراد: {yearStats.revenue.toLocaleString()}</div>
        <div>📈 الربح: {yearStats.gross.toLocaleString()}</div>
        <div>🤲 الصدقة: {yearStats.charity.toLocaleString()}</div>
        <div className="font-bold text-green-700">
          🟢 الصافي: {yearStats.net.toLocaleString()}
        </div>
      </div>

    </div>

    <div className="overflow-x-auto bg-white rounded-2xl shadow mb-8">

      <table className="w-full text-xs text-right">

        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">الطلب</th>
            <th className="p-2">الحالة</th>
            <th className="p-2">كمية</th>
            <th className="p-2">الإيراد</th>
            <th className="p-2">المجهز</th>
            <th className="p-2">الربح</th>
            <th className="p-2">الصدقة</th>
            <th className="p-2">الصافي</th>
            <th className="p-2">التاريخ</th>
          </tr>
        </thead>

        <tbody>
          {paidOrders.map((order) => {
            const qty = Number(order.quantity);
            const revenue = qty * sellPrice;
            const supplier = qty * buyPrice;
            const gross = qty * profitPerBox;
            const charity = gross * (charityPercent / 100);
            const net = gross - charity;

            return (
              <tr key={order.id} className="border-b hover:bg-gray-50">

                <td className="p-2 font-bold text-blue-700">
                  {order.code}
                </td>

                <td className="p-2">{order.status}</td>

                <td className="p-2">{qty}</td>

                <td className="p-2">
                  {revenue.toLocaleString()}
                </td>

                <td className="p-2">
                  {supplier.toLocaleString()}
                </td>

                <td className="p-2">
                  {gross.toLocaleString()}
                </td>

                <td className="p-2">
                  {charity.toLocaleString()}
                </td>

                <td className="p-2 font-bold text-green-700">
                  {net.toLocaleString()}
                </td>

                <td className="p-2 whitespace-nowrap text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}{" "}
                  {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

    </div>

    <div className="bg-white rounded-2xl shadow overflow-x-auto">

      <div className="p-4 font-bold text-lg border-b">
        🤲 المساجد الأقل حصولًا على الماء (آخر 30 يوم)
      </div>

      <table className="w-full text-xs text-right">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">المسجد</th>
            <th className="p-2">المنطقة</th>
            <th className="p-2">الصناديق</th>
            <th className="p-2">التقييم</th>
          </tr>
        </thead>

        <tbody>
          {mosqueNeeds.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">

              <td className="p-2 font-bold">{m.name}</td>

              <td className="p-2">{m.region}</td>

              <td className="p-2">{m.boxes}</td>

              <td className="p-2 font-bold">{m.level}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>

  </div>

</main>


);
}
