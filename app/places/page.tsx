import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const metadata = {
title: "سقاية - إدارة المناطق والمساجد",
};

const prisma = new PrismaClient();

async function addRegion(formData) {
"use server";

const name = formData.get("name")?.toString().trim();
const code = formData.get("code")?.toString().trim();

if (!name || !code) return;

const exists = await prisma.region.findUnique({
where: { code },
});

if (!exists) {
await prisma.region.create({
data: { name, code },
});
}

revalidatePath("/places");
}

async function addMosques(formData) {
"use server";

const regionId = formData.get("regionId")?.toString();
const names = formData.get("names")?.toString();

if (!regionId || !names) return;

const lines = names
.split("\n")
.map((x) => x.trim())
.filter((x) => x !== "");

for (const line of lines) {
const parts = line.split("|");


const name = parts[0]?.trim();
let code = parts[1]?.trim();

if (!name) continue;

if (!code || code === "") {
  code =
    name
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "")
      .toLowerCase() +
    "-" +
    Math.floor(Math.random() * 9999);
}

const exists = await prisma.mosque.findUnique({
  where: { code },
});

if (!exists) {
  await prisma.mosque.create({
    data: {
      name,
      code,
      regionId,
    },
  });
}


}

revalidatePath("/places");
}

export default async function PlacesPage() {
const regions = await prisma.region.findMany({
orderBy: {
name: "asc",
},
});

const mosques = await prisma.mosque.findMany({
include: {
region: true,
},
orderBy: {
id: "desc",
},
take: 50,
});

return ( <main className="min-h-screen bg-gray-100 p-4 text-black">


  <div className="max-w-5xl mx-auto space-y-6">

    <h1 className="text-2xl font-bold">
      إدارة المناطق والمساجد
    </h1>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-lg font-bold mb-4">
          إضافة منطقة جديدة
        </h2>

        <form action={addRegion} className="space-y-4">

          <input
            name="name"
            placeholder="اسم المنطقة"
            className="w-full border rounded-2xl p-3"
          />

          <input
            name="code"
            placeholder="كود مختصر مثال mansour"
            className="w-full border rounded-2xl p-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-2xl p-3 font-bold"
          >
            حفظ المنطقة
          </button>

        </form>

      </div>

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-lg font-bold mb-4">
          إضافة مساجد دفعة واحدة
        </h2>

        <form action={addMosques} className="space-y-4">

          <select
            name="regionId"
            className="w-full border rounded-2xl p-3 bg-white"
          >
            <option value="">
              اختر المنطقة
            </option>

            {regions.map((region) => (
              <option
                key={region.id}
                value={region.id}
              >
                {region.name}
              </option>
            ))}
          </select>

          <textarea
            name="names"
            rows={10}
            placeholder={`جامع النور | noor


جامع الرحمن | rahman
جامع التقوى | taqwa`}
className="w-full border rounded-2xl p-3"
/>


          <div className="text-xs text-gray-600 leading-6">
            كل سطر بهذا الشكل:
            اسم المسجد | الكود
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-2xl p-3 font-bold"
          >
            إضافة الجميع
          </button>

        </form>

      </div>

    </div>

    <div className="bg-white rounded-3xl shadow p-6">

      <h2 className="text-lg font-bold mb-4">
        آخر المساجد المضافة
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-sm text-right">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">المسجد</th>
              <th className="p-2">الكود</th>
              <th className="p-2">المنطقة</th>
            </tr>
          </thead>

          <tbody>
            {mosques.map((mosque) => (
              <tr
                key={mosque.id}
                className="border-b"
              >
                <td className="p-2">
                  {mosque.name}
                </td>

                <td className="p-2">
                  {mosque.code}
                </td>

                <td className="p-2">
                  {mosque.region?.name}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>

  </div>

</main>


);
}
