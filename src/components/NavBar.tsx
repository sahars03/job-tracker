"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const Navbar = () => {
  const { loggedIn, loading, refreshAuth } = useAuth();
  const router = useRouter();

  return (
    <nav className="w-full bg-[#076363] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold">
        JobTracker
      </Link>

      {!loading && (
        <div className="flex gap-6 items-center">
          <Link href="/applicationlist">Applications</Link>
          <Link href="/addnewjob">New</Link>

          {!loggedIn ? (
            <>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
            </>
          ) : (
            <>
              <Link href="/account">Account</Link>
              <button
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST" });
                  await refreshAuth(); // 🔥 update immediately
                  router.push("/login");
                }}
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