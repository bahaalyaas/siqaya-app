"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
const [orders, setOrders] = useState<any[]>([]);
const [q, setQ] = useState("");

const load = async () => {
const res = await fetch("/api/orders/list");
const data = await res.json();
setOrders(data);
};

useEffect(() => {
load();
}, []);

const updateStatus = async (id: number, status: string) => {
await fetch("/api/orders/status", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ id, status }),
});


load();


};

const getStatusText = (status: string) => {
if (status === "NEW") return "🟡 جديد";
if (status === "CONTACTED") return "🔵 تم التواصل";
if (status === "PAID") return "🟣 تم الدفع";
if (status === "DONE") return "🟢 مكتمل";
if (status === "CANCELLED") return "🔴 ملغي";
return status;
};

const filteredOrders: any[] = useMemo(() => {
return orders.filter((order: any) => {
const query = q.toLowerCase();


  return (
    order.code?.toLowerCase().includes(query) ||
    order.name?.toLowerCase().includes(query) ||
    order.phone?.toLowerCase().includes(query) ||
    order.region?.name?.toLowerCase().includes(query) ||
    order.mosque?.name?.toLowerCase().includes(query)
  );
});


}, [orders, q]);

const regions = useMemo(() => {
const list = (orders as any[])
.map((o) => o.region?.name)
.filter(Boolean);


return [...new Set(list)];


}, [orders]);

const statsAll = {
total: orders.length,
qty: (orders as any[]).reduce(
(a, b) => a + Number(b.quantity),
0
),
done: orders.filter((o: any) => o.status === "DONE").length,
cancelled: orders.filter((o: any) => o.status === "CANCELLED").length,
};

const statsCurrent = {
total: filteredOrders.length,
newCount: filteredOrders.filter((o: any) => o.status === "NEW").length,
paid: filteredOrders.filter((o: any) => o.status === "PAID").length,
};

return ( <main className="p-6 text-black">


  <h1 className="text-2xl font-bold mb-4">
    إدارة الطلبات
  </h1>

  <input
    placeholder="بحث..."
    value={q}
    onChange={(e) => setQ(e.target.value)}
    className="border p-3 rounded mb-4 w-full"
  />

  <div className="grid grid-cols-2 gap-4 mb-6">

    <div className="bg-white p-4 rounded shadow">
      إجمالي: {statsAll.total}
    </div>

    <div className="bg-white p-4 rounded shadow">
      الكمية: {statsAll.qty}
    </div>

    <div className="bg-white p-4 rounded shadow">
      مكتمل: {statsAll.done}
    </div>

    <div className="bg-white p-4 rounded shadow">
      ملغي: {statsAll.cancelled}
    </div>

  </div>

  <div className="space-y-4">

    {filteredOrders.map((order: any) => (
      <div
        key={order.id}
        className="bg-white p-4 rounded shadow"
      >
        <div className="font-bold">
          {order.code}
        </div>

        <div>{order.name}</div>
        <div>{order.phone}</div>
        <div>{order.region?.name}</div>
        <div>{order.mosque?.name}</div>
        <div>الكمية: {order.quantity}</div>

        <div className="mt-2">
          {getStatusText(order.status)}
        </div>

        <div className="flex gap-2 mt-3">

          <button onClick={() => updateStatus(order.id, "PAID")}>
            دفع
          </button>

          <button onClick={() => updateStatus(order.id, "DONE")}>
            تم
          </button>

          <button onClick={() => updateStatus(order.id, "CANCELLED")}>
            إلغاء
          </button>

        </div>

      </div>
    ))}

  </div>

</main>


);
}
