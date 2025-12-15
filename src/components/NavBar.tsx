"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("../api/auth/me", {
          credentials: "include", // IMPORTANT for cookies
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
    <nav className="w-full bg-[#076363] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link href="/">JobTracker</Link>
      </div>

      {!loading && (
        <div className="flex gap-6 items-center">
          <Link href="/applicationlist" className="hover:text-blue-300">
            Applications
          </Link>
          <Link href="/addnewjob" className="hover:text-blue-300">
            New
          </Link>

          {!loggedIn ? (
            <>
              <Link href="/register" className="hover:text-blue-300">
                Register
              </Link>
              <Link href="/login" className="hover:text-blue-300">
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm italic">Hi, {username}</span>
              <Link href="/account" className="hover:text-blue-300">
                Account
              </Link>
              <button
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST" });
                  setLoggedIn(false);
                  setUsername(null);
                }}
                className="hover:text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;