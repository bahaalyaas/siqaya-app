"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
const searchParams = useSearchParams();
const order = searchParams.get("order");

return ( <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 flex justify-center items-center p-4">


  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-green-100 text-center">

    <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-md border flex items-center justify-center overflow-hidden mb-4">
      <img
        src="/logo.png"
        alt="سقاية"
        className="w-full h-full object-contain p-2"
      />
    </div>

    <h1 className="text-3xl font-extrabold text-green-600 mb-3">
      تم استلام طلبكم بنجاح
    </h1>

    <p className="text-gray-600 leading-7 mb-4">
      جزاكم الله خيراً على مساهمتكم المباركة،
      وسيتم التواصل معكم قريباً.
    </p>

    <div className="bg-gray-50 rounded-2xl p-4 mb-5 border">
      <p className="text-sm text-gray-500">رقم الطلب</p>
      <p className="text-lg font-bold text-blue-700 break-all">
        {order}
      </p>
    </div>

    <div className="bg-blue-50 rounded-2xl p-4 mb-5 text-sm text-gray-700 leading-7">
      يرجى الاحتفاظ برقم الطلب لحين التواصل معكم.
    </div>

    <Link
      href="/"
      className="block w-full bg-green-600 text-white py-4 rounded-2xl font-bold"
    >
      طلب جديد
    </Link>

  </div>

</main>


);
}
