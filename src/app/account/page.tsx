"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshAuth } = useAuth();
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState(useSearchParams().get("updated") || "");

  const searchParams = useSearchParams();
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/me`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      setShowDeleteConfirm(false);
      const remove = async () => {
        await fetch("/api/logout", { method: "POST" });
        await refreshAuth();
        router.push("/login");
      }

      remove();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

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

    useEffect(() => {
      if (searchQuery === "false") {
        console.log("False");
        console.log(`Search params: ${searchParams}`);
          setSearchQuery("");
          router.replace("/account");
          router.refresh();    
      }
    }, [searchQuery]);

  useEffect(() => {
    if (searchQuery === "true") {
        console.log(`SearchQuery: ${searchQuery}`);
      setShowUpdateSuccess(true);

      const timer = setTimeout(() => {
        setSearchQuery("");
        setShowUpdateSuccess(false);
        router.replace("/account");
        router.refresh();
      }, 3000);
    
      return () => clearTimeout(timer);
    }
}, [searchQuery]);

  return (
    <div className="font-sans min-h-screen flex flex-col items-center pt-10">
      {showUpdateSuccess && (
      <div className="fixed bottom centre z-50 bg-gray-300 border-black text-white px-4 py-3 rounded shadow-lg animate-fade-in">
        Account updated successfully
      </div>
    )}
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

      <div className="flex flex-row justify-center gap-15">
                <button
                  className="bg-[#4a90e2] hover:bg-[#5ba1f3] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST" });
                  await refreshAuth();
                  router.push("/login");
                }}
                >
                  Log out
                </button>

                <button
                  className="bg-[#50c878] hover:bg-[#61d989] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                  onClick={() => {router.push("/editaccount");}}>
                  Change details
                </button>

                <button onClick={() => setShowDeleteConfirm(true)}
                  className= "bg-[#d7551f] hover:bg-[#e8662f] mb-4 text-white rounded px-4 py-3 font-bold w-[150px] text-xl"
                >
                  Delete account
                </button>
        </div>
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur flex items-center border-black justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="font-sans font-semibold text-2xl text-center mb-3">Confirm Delete</h3>
              <p className="font-sans text-center text-lg mb-2">Are you sure you want to delete your account?</p>
            <div className="flex flex-row justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#d7551f] hover:bg-[#e8662f] px-4 py-2 text-white rounded "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
          {/* 
           */}
    </div>
    </div>
  )};