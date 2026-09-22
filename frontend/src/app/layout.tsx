import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import AuraBackground from "@/components/AuraBackground";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "interbridge",
  description: "find out which provincial regulations block your expansion, in plain language.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${ebGaramond.variable}`}>
        <AuraBackground />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
