// app/lib/auth.ts

import { jwtDecode } from "jwt-decode";


type DecodedToken = {
  userId: number;
  role: "ADMIN" | "CANDIDATE";
  exp: number;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getUserFromToken(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}
