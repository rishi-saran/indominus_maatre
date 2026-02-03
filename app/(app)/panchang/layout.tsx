import { ReactNode } from "react";

export default function PanchangLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Panchang page handles its own layout
  return <>{children}</>;
}
