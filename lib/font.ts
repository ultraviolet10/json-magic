import localFont from "next/font/local";

export const ligo = localFont({
  src: [
    {
        path: "../public/font/Ligo.ttf",
        weight: "400",
    },
  ],
  variable: "--font-ligo",
});
