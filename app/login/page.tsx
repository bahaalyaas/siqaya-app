"use client";

import { useState } from "react";

export default function LoginPage() {
const [password, setPassword] = useState("");

const submit = async (e) => {
e.preventDefault();


const res = await fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ password }),
});

const data = await res.json();

if (data.success) {
  window.location.href = "/dashboard";
} else {
  alert("كلمة المرور غير صحيحة");
}


};

return ( <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">


  <form
    onSubmit={submit}
    className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-4"
  >

    <h1 className="text-2xl font-bold text-center text-black">
      دخول الإدارة
    </h1>

    <input
      type="password"
      placeholder="كلمة المرور"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border rounded-2xl p-3 text-black"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white rounded-2xl p-3 font-bold"
    >
      دخول
    </button>

  </form>

</main>


);
}
