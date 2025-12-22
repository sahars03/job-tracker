"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("api/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("logged in");
          setLoggedIn(true);
          setUsername(data.username);
        } else {
          console.log("not logged in...");
          setLoggedIn(false);
        }
      } catch {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <div className="-mt-64 flex flex-col items-center ">
        <p className="font-sans text-5xl">Hi, {username}</p>
        <button 
        className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
        onClick={() => {router.push("/addnewjob")}}>
          New application
        </button>
      </div>
    </div>
  );
}