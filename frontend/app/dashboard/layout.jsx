"use client";

import { useState } from "react";
import DashNavbar from "./components/DashNavbar";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex min-h-screen items-start'>
      <Sidebar open={open} setOpen={setOpen} />
      <div className='flex-1'>
        <DashNavbar setOpen={setOpen} />
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}
