import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinarithm Alpha",
  description: "Matematikte derinleşmek için.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
