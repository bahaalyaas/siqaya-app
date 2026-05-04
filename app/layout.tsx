import "./globals.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata = {
  title: "سقـاية",
  description: "مشروع سقيا المساجد",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className + " bg-white"}>
        {children}
      </body>
    </html>
  );
}