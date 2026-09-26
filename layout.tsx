import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "interbridge",
  description: "find out what's blocking your business from expanding across provinces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-3xl mx-auto px-6 py-16">{children}</div>
      </body>
    </html>
  );
}
