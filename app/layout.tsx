import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knytkalas",
  description: "Planera ditt knytkalas enkelt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-amber-50 text-gray-800">
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
