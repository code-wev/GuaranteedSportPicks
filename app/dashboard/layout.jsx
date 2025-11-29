"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashNavbar from "./components/DashNavbar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">
        <DashNavbar setOpen={setOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
