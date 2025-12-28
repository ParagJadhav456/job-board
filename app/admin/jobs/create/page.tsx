"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/lib/auth";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Protect admin route
  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.role !== "ADMIN") {
      router.push("/jobs");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        company,
        location,
        jobType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create job");
      setLoading(false);
      return;
    }

    router.push("/jobs");
  };

  return (
    <div style={{ padding: "30px", maxWidth: 700 }}>
      <h1>Create Job</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        />
        <br /><br />

        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating job..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
