import type { Metadata } from "next";
import "./globals.css";
import { ShellLayout } from "@/components/layout/ShellLayout/ShellLayout";

export const metadata: Metadata = {
  title: "Quantergy",
  description: "Quantergy dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
