"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function WelcomePage() {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  // check if the user is logged in, and direct them to the appropriate starting page
  useEffect(() => {
    if (loading) return;

    // if the user is logged in, they start on their application list 
    if (loggedIn) {
      router.replace("/applicationlist");
    // otherwise, the user must log in to use the application
    } else {
      router.replace("/login");
    }
  }, [loading, loggedIn, router]);

  // loading
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}