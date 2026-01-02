import { ReactNode } from "react";
import { Navbar } from "@/app/(components)/navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
    </>
  );
}
