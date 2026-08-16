import type { Metadata } from "next";
import { ToolkitApp } from "@/components/toolkit/ToolkitApp";

export const metadata: Metadata = {
  title: "Toolkit — phosphor",
  description: "phosphor operator console: live mempool stream, contract event tracking, and exploit sandbox.",
};

export default function ToolkitPage() {
  return (
    <main className="min-h-screen">
      <ToolkitApp />
    </main>
  );
}
