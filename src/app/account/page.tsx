"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
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
          setLoggedIn(true);
          setUsername(data.username);
          setEmail(data.email)
        } else {
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
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {/* main page */}
      <p className="font-sans text-6xl">Account</p>
      <div className="h-[2px] bg-gray-300 w-200 my-4"></div>
    <div className="font-sans min-h-screen flex flex-col items-center gap-8 pt-10">

        <div className="flex flex-col items-center gap-3 border border-black rounded-xl p-6 shadow-sm bg-white">
            <p className="font-sans text-2xl italic">
                <span className="font-semibold not-italic">Username:</span> {username}
            </p>
            <p className="font-sans text-2xl italic">
                <span className="font-semibold not-italic">Email:</span> {email}
            </p>
        </div>

        <div className="flex items-center gap-15">

                <button
                  className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                >
                  Log out of account
                </button>

                <button
                  className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                >
                  Change details
                </button>

                <button
                  className= "bg-[#d7551f] hover:bg-[#e8662f] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                >
                  Delete account
                </button>
        </div>

          {/* 
           */}
    </div>
    </div>
  )};