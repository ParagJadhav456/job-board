"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
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
        throw new Error(data.error || "Failed to create job");
      }

      router.push("/jobs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h2>Create New Job</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        /><br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        /><br /><br />

        <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={{
                backgroundColor: "#1f2937",   // dark gray
                color: "#ffffff",
                border: "1px solid #374151",
                padding: "8px",
                borderRadius: "6px"
            }}
            >
            <option value="FULL_TIME" style={{ backgroundColor: "#1f2937", color: "#fff" }}>
                Full Time
            </option>
            <option value="PART_TIME" style={{ backgroundColor: "#1f2937", color: "#fff" }}>
                Part Time
            </option>
            <option value="CONTRACT" style={{ backgroundColor: "#1f2937", color: "#fff" }}>
                Contract
            </option>
        </select><br /><br />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
