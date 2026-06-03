import type { Metadata } from "next";
import "./globals.css";
import { ShellLayout } from "@/components/layout/ShellLayout/ShellLayout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Wattrgy",
  description: "Wattrgy dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ShellLayout>{children}</ShellLayout>
        <Toaster />
      </body>
    </html>
  );
}
