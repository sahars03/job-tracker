// components/Navbar.tsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#076363] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link href="/">JobTracker</Link>
      </div>
      <div className="flex gap-6">
        <Link href="/applicationlist" className="hover:text-blue-300">
          Applications
        </Link>
        <Link href="/addnewjob" className="hover:text-blue-300">
          New
        </Link>
        <Link href="/register" className="hover:text-blue-300">
          Register
        </Link>
        <Link href="/login" className="hover:text-blue-300">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;