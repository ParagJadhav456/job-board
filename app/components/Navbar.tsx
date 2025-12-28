"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromToken, logout } from "@/app/lib/auth";

type User = {
  userId: number;
  role: "ADMIN" | "CANDIDATE";
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // ✅ Run only on client AFTER hydration
  useEffect(() => {
    setMounted(true);
    const decodedUser = getUserFromToken();
    setUser(decodedUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  // 🔒 Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <nav
      style={{
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #333",
      }}
    >
      <strong>JobBoard</strong>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/jobs">Jobs</Link>

        {user?.role === "CANDIDATE" && (
          <Link href="/my-applications">My Applications</Link>
        )}

        {user?.role === "ADMIN" && (
          <Link href="/admin/jobs/new">Create Job</Link>
        )}

        {user ? (
          <>
            <span style={{ opacity: 0.7 }}>
              Role: {user.role}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
