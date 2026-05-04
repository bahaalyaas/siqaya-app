"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePage() {
const [regions, setRegions] = useState([]);
const [mosques, setMosques] = useState([]);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [regionId, setRegionId] = useState("");
const [mosqueId, setMosqueId] = useState("");
const [quantity, setQuantity] = useState(1);

useEffect(() => {
document.title = "سقاية - طلب جديد";
loadRegions();
}, []);

const loadRegions = async () => {
const res = await fetch("/api/regions");
const data = await res.json();
setRegions(data);
};

const loadMosques = async (id) => {
const res = await fetch(`/api/mosques?regionId=${id}`);
const data = await res.json();
setMosques(data);
};

const submitOrder = async (e) => {
e.preventDefault();


const res = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    phone,
    regionId,
    mosqueId,
    quantity,
  }),
});

const data = await res.json();

if (data.success) {
window.location.href =
"/success?order=" +
encodeURIComponent(data.code || data.orderId);

} else {
  alert("حدث خطأ أثناء إرسال الطلب");
}


};

const total = quantity * 2000;

return ( <main className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white px-4 py-8">


  <div className="max-w-xl mx-auto">

    <div className="text-center mb-8">

      <div className="flex justify-center mb-8">
  <Image
    src="/logo.png"
    alt="logo"
    width={420}
    height={420}
    priority
    className="drop-shadow-[0_22px_40px_rgba(0,0,0,0.28)]"
  />
</div>


      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-3xl shadow-xl p-6 mb-4">
        <p className="text-lg font-bold leading-9">
          ساهم في سقيا بيوت الله،
          واجعل لك أجرًا لا ينقطع
          مع كل قطرة ماء تصل إلى مسجد
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-emerald-800 text-sm font-semibold leading-7">
          جميع طلبات التوصيل يتم توثيقها بالصور لضمان المصداقية
          وطمأنينة المساهمين على وصول الماء إلى المسجد المستهدف
        </p>
      </div>

    </div>

    <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-6">

      <form onSubmit={submitOrder} className="space-y-5">

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800">
            الاسم الكامل
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 p-4 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800">
            رقم الهاتف
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 p-4 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800">
            المنطقة
          </label>

          <select
            value={regionId}
            onChange={(e) => {
              setRegionId(e.target.value);
              setMosqueId("");
              loadMosques(e.target.value);
            }}
            required
            className="w-full rounded-2xl border border-gray-300 p-4 text-black bg-white"
          >
            <option value="">اختر المنطقة</option>

            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800">
            المسجد
          </label>

          <select
            value={mosqueId}
            onChange={(e) => setMosqueId(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 p-4 text-black bg-white"
          >
            <option value="">اختر المسجد</option>

            {mosques.map((mosque) => (
              <option key={mosque.id} value={mosque.id}>
                {mosque.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">

          <label className="block text-sm font-bold text-gray-800">
            عدد الصناديق
          </label>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-14 h-14 rounded-2xl bg-blue-700 text-white text-2xl font-bold shadow-lg"
            >
              -
            </button>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-28 h-14 text-center rounded-2xl border border-gray-300 text-black font-bold text-lg"
            />

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-14 h-14 rounded-2xl bg-blue-700 text-white text-2xl font-bold shadow-lg"
            >
              +
            </button>

          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">

            <div className="text-sm text-gray-800">
              سعر الصندوق الواحد:
              <span className="font-bold mr-2 text-blue-700">
                2,000 د.ع
              </span>
            </div>

            <div className="text-sm text-gray-800">
              الإجمالي:
              <span className="font-bold text-green-700 text-2xl mr-2">
                {total.toLocaleString()}
              </span>
              د.ع
            </div>

            <div className="text-xs text-gray-600 border-t pt-3 leading-6">
              يشمل التجهيز والتوصيل داخل المنطقة المحددة
            </div>

          </div>

        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-5 font-bold text-lg shadow-xl"
        >
          إرسال الطلب الآن
        </button>

      </form>

    </div>

  </div>

</main>


);
}
