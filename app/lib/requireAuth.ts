import { isLoggedIn } from "./auth";
import { redirect } from "next/navigation";

export function requireAuth() {
    if (!isLoggedIn()){
        redirect("/login");
    }
}