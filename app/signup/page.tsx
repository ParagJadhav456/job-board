"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage(){
    const router= useRouter();
    const [form, setForm ] = useState({
        name:"",
        email:"",
        password:"",
        role:"CANDIDATE",
    });
    const [error,setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange =(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const res = await fetch("/api/auth/signup",{
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok){
                setError(data.error || "Signup failed");
                setLoading(false);
                return;
            }

            // succes => redirect to login

            router.push("/login");
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };
    return (
        <div style={{ maxWidth: 400, margin: "50px auto"}}>
            <h2>Signup</h2>

            {error && <p style={{color:"red"}}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input
                    name= "name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input 
                    name="email"
                    type= "email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="CANDIDATE">Candidate</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <br /><br />

                <button type="submit" disabled={loading}>
                    {loading ? "Signining up...":"Signup"}
                </button>
            </form>
        </div>
    );
}