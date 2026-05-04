"use client";

import { useEffect, useMemo, useState } from "react";

export default function FinancePage() {
const [orders, setOrders] = useState<any[]>([]);

const load = async () => {
const res = await fetch("/api/orders/list");
const data = await res.json();
setOrders(data);
};

useEffect(() => {
load();
}, []);

const now = new Date();

const isToday = (date: any) =>
new Date(date).toDateString() === now.toDateString();

const isThisMonth = (date: any) => {
const d = new Date(date);
return (
d.getMonth() === now.getMonth() &&
d.getFullYear() === now.getFullYear()
);
};

const calcBoxes = (list: any[]) =>
list.reduce((sum: number, item: any) => sum + Number(item.quantity), 0);

const calcFinance = (boxes: number) => {
const pricePerBox = 2000;
return boxes * pricePerBox;
};

const todayOrders = useMemo(
() => orders.filter((o: any) => isToday(o.createdAt)),
[orders]
);

const monthOrders = useMemo(
() => orders.filter((o: any) => isThisMonth(o.createdAt)),
[orders]
);

const totalBoxesToday = calcBoxes(todayOrders);
const totalBoxesMonth = calcBoxes(monthOrders);

const totalFinanceToday = calcFinance(totalBoxesToday);
const totalFinanceMonth = calcFinance(totalBoxesMonth);

return ( <main className="min-h-screen p-6 bg-gray-100 text-black">


  <div className="max-w-4xl mx-auto space-y-6">

    <h1 className="text-3xl font-bold">
      المالية
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-white p-6 rounded-3xl shadow">
        <div className="text-gray-500 text-sm">
          أرباح اليوم
        </div>

        <div className="text-2xl font-bold mt-2 text-green-700">
          {totalFinanceToday.toLocaleString()} د.ع
        </div>

        <div className="text-sm mt-2 text-gray-600">
          عدد الصناديق: {totalBoxesToday}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow">
        <div className="text-gray-500 text-sm">
          أرباح الشهر
        </div>

        <div className="text-2xl font-bold mt-2 text-blue-700">
          {totalFinanceMonth.toLocaleString()} د.ع
        </div>

        <div className="text-sm mt-2 text-gray-600">
          عدد الصناديق: {totalBoxesMonth}
        </div>
      </div>

    </div>

  </div>

</main>


);
}
