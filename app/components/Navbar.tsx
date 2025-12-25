"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/app/lib/auth";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: number;
  role: "ADMIN" | "CANDIDATE";
  exp: number;
};

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoggedIn(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setLoggedIn(true);
      setRole(decoded.role);
    } catch {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link href="/">JobBoard</Link>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        {!loggedIn && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link href="/jobs">Jobs</Link>
            <Link href="/applications">My Applications</Link>

            <span style={{ opacity: 0.7 }}>
              Role: <strong>{role}</strong>
            </span>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
