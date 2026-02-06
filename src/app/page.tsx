"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function WelcomePage() {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (loggedIn) {
      router.push("/applicationlist");
    } else {
      router.push("/login");
    }
  }, [loggedIn, loading, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}
