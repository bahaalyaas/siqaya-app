

"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
const [orders, setOrders] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [regionFilter, setRegionFilter] = useState("ALL");

const loadOrders = async () => {
const res = await fetch("/api/orders/list");
const data = await res.json();
setOrders(data);
};

useEffect(() => {
document.title = "سقاية - الإدارة";
loadOrders();
}, []);


const updateStatus = async (id: number, status: string) => {

await fetch("/api/orders/status", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ id, status }),
});


loadOrders();


};

const getStatusText = (status: string) => {

if (status === "NEW") return "🟡 جديد";
if (status === "CONTACTED") return "🔵 تم التواصل";
if (status === "PAID") return "🟣 تم الدفع";
if (status === "DONE") return "🟢 مكتمل";
if (status === "CANCELLED") return "🔴 ملغي";
return status;
};

const regions = useMemo(() => {
const list = orders.map((o) => o.region?.name).filter(Boolean);
return [...new Set(list)];
}, [orders]);

const filteredOrders = useMemo(() => {
return orders.filter((order) => {
const q = search.toLowerCase();


  const matchesSearch =
    order.code?.toLowerCase().includes(q) ||
    order.name?.toLowerCase().includes(q) ||
    order.phone?.toLowerCase().includes(q) ||
    order.region?.name?.toLowerCase().includes(q) ||
    order.mosque?.name?.toLowerCase().includes(q);

  const matchesStatus =
    statusFilter === "ALL" || order.status === statusFilter;

  const matchesRegion =
    regionFilter === "ALL" || order.region?.name === regionFilter;

  return matchesSearch && matchesStatus && matchesRegion;
});


}, [orders, search, statusFilter, regionFilter]);

const statsAll = {
total: orders.length,
qty: orders.reduce((a, b) => a + Number(b.quantity), 0),
done: orders.filter((o) => o.status === "DONE").length,
cancelled: orders.filter((o) => o.status === "CANCELLED").length,
};

const statsCurrent = {
total: filteredOrders.length,
newCount: filteredOrders.filter((o) => o.status === "NEW").length,
paid: filteredOrders.filter((o) => o.status === "PAID").length,
};

const waLink = (order) => {
const phone = order.phone.replace(/^0/, "964");


const msg = `السلام عليكم،


تم استلام طلبكم في مشروع سقاية بنجاح.

رقم الطلب: ${order.code}
المنطقة: ${order.region?.name}
المسجد: ${order.mosque?.name}
الكمية: ${order.quantity}

وسيتم التواصل معكم قريباً.

جزاكم الله خيراً 🌿`;


return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;


};

return ( <main className="min-h-screen bg-gray-100 p-3 text-black">


  <div className="max-w-7xl mx-auto">

    <h1 className="text-xl font-bold mb-3 text-gray-800">
      لوحة إدارة الطلبات
    </h1>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">

      <div className="bg-white p-3 rounded-xl shadow text-black">
        📦 إجمالي الطلبات: {statsAll.total}
      </div>

      <div className="bg-white p-3 rounded-xl shadow text-black">
        📚 الكمية الكلية: {statsAll.qty}
      </div>

      <div className="bg-white p-3 rounded-xl shadow text-black">
        🟢 مكتمل: {statsAll.done}
      </div>

      <div className="bg-white p-3 rounded-xl shadow text-black">
        🔴 ملغي: {statsAll.cancelled}
      </div>

    </div>

    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">

      <div className="bg-yellow-100 p-3 rounded-xl text-black">
        النتائج الحالية: {statsCurrent.total}
      </div>

      <div className="bg-blue-100 p-3 rounded-xl text-black">
        الجديد الحالي: {statsCurrent.newCount}
      </div>

      <div className="bg-purple-100 p-3 rounded-xl text-black">
        الدفع الحالي: {statsCurrent.paid}
      </div>

    </div>

    <div className="grid md:grid-cols-3 gap-2 mb-3">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="بحث: اسم / هاتف / طلب / مسجد"
        className="p-2 rounded-xl border text-sm text-black bg-white"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 rounded-xl border text-sm text-black bg-white"
      >
        <option value="ALL">الكل</option>
        <option value="NEW">جديد</option>
        <option value="CONTACTED">تم التواصل</option>
        <option value="PAID">تم الدفع</option>
        <option value="DONE">مكتمل</option>
        <option value="CANCELLED">ملغي</option>
      </select>

      <select
        value={regionFilter}
        onChange={(e) => setRegionFilter(e.target.value)}
        className="p-2 rounded-xl border text-sm text-black bg-white"
      >
        <option value="ALL">كل المناطق</option>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

    </div>

    <div className="overflow-x-auto bg-white rounded-2xl shadow">

      <table className="w-full text-xs text-right text-black">

        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">الطلب</th>
            <th className="p-2">الاسم</th>
            <th className="p-2">الهاتف</th>
            <th className="p-2">واتساب</th>
            <th className="p-2">المنطقة</th>
            <th className="p-2">المسجد</th>
            <th className="p-2">كمية</th>
            <th className="p-2">الحالة</th>
            <th className="p-2">إجراءات</th>
            <th className="p-2">التاريخ</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              className="border-b text-black hover:bg-gray-50"
            >

              <td className="p-2 font-bold text-blue-700">
                {order.code}
              </td>

              <td className="p-2">{order.name}</td>

              <td className="p-2">{order.phone}</td>

              <td className="p-2">
                <a
                  href={waLink(order)}
                  target="_blank"
                  className="bg-green-600 text-white px-2 py-1 rounded text-[11px]"
                >
                  واتساب
                </a>
              </td>

              <td className="p-2">{order.region?.name}</td>

              <td className="p-2">{order.mosque?.name}</td>

              <td className="p-2 text-center">{order.quantity}</td>

              <td className="p-2 whitespace-nowrap font-bold">
                {getStatusText(order.status)}
              </td>

              <td className="p-2 space-x-1 whitespace-nowrap">

                <button
                  onClick={() => updateStatus(order.id, "NEW")}
                  className="bg-yellow-500 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  جديد
                </button>

                <button
                  onClick={() => updateStatus(order.id, "CONTACTED")}
                  className="bg-blue-600 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  تواصل
                </button>

                <button
                  onClick={() => updateStatus(order.id, "PAID")}
                  className="bg-purple-600 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  دفع
                </button>

                <button
                  onClick={() => updateStatus(order.id, "DONE")}
                  className="bg-green-600 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  مكتمل
                </button>

                <button
                  onClick={() => updateStatus(order.id, "CANCELLED")}
                  className="bg-red-600 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  ملغي
                </button>

              </td>

              <td className="p-2 whitespace-nowrap text-gray-700">
                {new Date(order.createdAt).toLocaleDateString("en-GB")}{" "}
                {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>

  </div>

</main>


);
}
