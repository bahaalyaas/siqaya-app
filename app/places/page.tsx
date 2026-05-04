"use client";

import { useEffect, useState } from "react";

export default function PlacesPage() {
const [regions, setRegions] = useState<any[]>([]);
const [mosques, setMosques] = useState<any[]>([]);
const [regionName, setRegionName] = useState("");
const [mosqueName, setMosqueName] = useState("");
const [regionId, setRegionId] = useState("");

const load = async () => {
const res = await fetch("/api/regions");
const data = await res.json();
setRegions(data);


const res2 = await fetch("/api/mosques");
const data2 = await res2.json();
setMosques(data2);


};

useEffect(() => {
load();
}, []);

const addRegion = async (e: any) => {
e.preventDefault();


await fetch("/api/regions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: regionName }),
});

setRegionName("");
load();


};

const addMosque = async (e: any) => {
e.preventDefault();

```
await fetch("/api/mosques", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: mosqueName,
    regionId,
  }),
});

setMosqueName("");
load();


};

return ( <main className="min-h-screen bg-gray-100 p-6 text-black">


  <div className="max-w-4xl mx-auto space-y-8">

    <h1 className="text-3xl font-bold">
      المناطق والمساجد
    </h1>

    <div className="grid md:grid-cols-2 gap-6">

      <form onSubmit={addRegion} className="bg-white p-6 rounded-3xl shadow space-y-4">

        <h2 className="font-bold text-lg">
          إضافة منطقة
        </h2>

        <input
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          placeholder="اسم المنطقة"
          className="w-full border p-3 rounded-2xl"
          required
        />

        <button className="bg-blue-700 text-white w-full py-3 rounded-2xl font-bold">
          إضافة
        </button>

      </form>

      <form onSubmit={addMosque} className="bg-white p-6 rounded-3xl shadow space-y-4">

        <h2 className="font-bold text-lg">
          إضافة مسجد
        </h2>

        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="w-full border p-3 rounded-2xl"
          required
        >
          <option value="">اختر المنطقة</option>

          {regions.map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <input
          value={mosqueName}
          onChange={(e) => setMosqueName(e.target.value)}
          placeholder="اسم المسجد"
          className="w-full border p-3 rounded-2xl"
          required
        />

        <button className="bg-green-600 text-white w-full py-3 rounded-2xl font-bold">
          إضافة
        </button>

      </form>

    </div>

    <div className="bg-white p-6 rounded-3xl shadow">

      <h2 className="font-bold mb-4">
        قائمة المساجد
      </h2>

      <div className="space-y-3">

        {mosques.map((m: any) => (
          <div key={m.id} className="border p-3 rounded-xl">

            <div className="font-bold">
              {m.name}
            </div>

            <div className="text-sm text-gray-500">
              {m.region?.name}
            </div>

          </div>
        ))}

      </div>

    </div>

  </div>

</main>


);
}
