"use client";

import { useEffect, useState } from "react";
import { isLoggedIn, getUserFromToken } from "@/app/lib/auth";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const logged = isLoggedIn();

    if (!logged) {
      router.push("/login");
      return;
    }

    setMounted(true);
    setLoggedIn(logged);
    setUser(getUserFromToken());
  }, [router]);

  if (!mounted) return null;

  return (
    <div style={{ padding: 40 }}>
      <h2>Auth Debug</h2>

      <p>
        <strong>Logged In:</strong> {String(loggedIn)}
      </p>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
