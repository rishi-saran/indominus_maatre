import { ReactNode } from "react";
import { Navbar } from "@/app/(components)/navbar";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Toaster richColors position="top-right" />
    </>
  );
}
