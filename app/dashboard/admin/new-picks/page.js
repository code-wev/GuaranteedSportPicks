
import CreatePickForm from "@/components/Dashboard/admin/CreatePickForm";
import QuickActionsSidebar from "@/components/Dashboard/admin/QuickActionsSidebar";
import { FiEye } from "react-icons/fi";

export default function Page() {
  return (
    <div className="w-full space-y-6">

      {/* ======= TOP HEADER ======= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">New Pick</h1>

        <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
          <FiEye className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* ======= 2 COLUMN LAYOUT ======= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <CreatePickForm />
        <QuickActionsSidebar />
      </div>
    </div>
  );
}
