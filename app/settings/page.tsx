import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const metadata = {
title: "سقاية - إعدادات الأسعار",
};


const prisma = new PrismaClient();

export default async function SettingsPage() {
let settings = await prisma.settings.findFirst();

if (!settings) {
settings = await prisma.settings.create({
data: {
sellPrice: 2000,
buyPrice: 1500,
charityPercent: 10,
},
});
}

async function saveSettings(formData) {
"use server";


const sellPrice = Number(formData.get("sellPrice"));
const buyPrice = Number(formData.get("buyPrice"));
const charityPercent = Number(formData.get("charityPercent"));

await prisma.settings.update({
  where: {
    id: settings.id,
  },
  data: {
    sellPrice,
    buyPrice,
    charityPercent,
  },
});

revalidatePath("/settings");


}

return ( <main className="min-h-screen bg-gray-100 p-6 text-black">


  <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">

    <h1 className="text-2xl font-bold mb-6">
      إعدادات الأسعار
    </h1>

    <form action={saveSettings} className="space-y-4">

      <div>
        <label className="block mb-1 font-bold">
          سعر البيع للصندوق
        </label>

        <input
          type="number"
          name="sellPrice"
          defaultValue={settings.sellPrice}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">
          سعر شراء المجهز
        </label>

        <input
          type="number"
          name="buyPrice"
          defaultValue={settings.buyPrice}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">
          نسبة الصدقة %
        </label>

        <input
          type="number"
          name="charityPercent"
          defaultValue={settings.charityPercent}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-xl p-3 font-bold"
      >
        حفظ التغييرات
      </button>

    </form>

  </div>

</main>

);
}
