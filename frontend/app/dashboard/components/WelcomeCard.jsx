"use client";
import { useMyProfileQuery } from "@/feature/UserApi";

export default function WelcomeCard() {
  const { data } = useMyProfileQuery();
  const user = data?.data;

  return (
    <div className="bg-[#D32F2F] text-white rounded-xl shadow-md h-[126px] flex flex-col justify-center pl-6 gap-3">
      <h2 className="text-2xl font-semibold">
        Welcome back, {user?.firstName || "User"} 👋
      </h2>
      <p className="opacity-90 mt-1">Ready for today&apos;s winning pick?</p>
    </div>
  );
}
