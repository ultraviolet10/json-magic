import "./globals.css";
import { Inter } from "next/font/google";
import { ligo } from "@/lib/font";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "json-magic",
  description: "use your json well",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ligo.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
