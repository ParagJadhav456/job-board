"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string;
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to apply");
      return;
    }

    setApplying(true);
    setError("");

    const res = await fetch(`/api/jobs/${id}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resume: "resume.pdf",
        coverNote: "Interested in this role",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to apply");
      setApplying(false);
      return;
    }

    // success
    setAlreadyApplied(true);
    setApplying(false);
  };

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    }

    async function checkApplied() {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlreadyApplied(false);
        return;
      }
      const res = await fetch(`/api/jobs/${id}/applied`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setAlreadyApplied(data.applied);
    }

    if (id) {
      fetchJob();
      checkApplied();
    }
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading job...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  if (!job) return <p style={{ padding: 20 }}>Job not found</p>;

  return (
  <div
    style={{
      padding: "40px",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
    {/* Job Title */}
    <h1 style={{ marginBottom: "10px" }}>{job.title}</h1>

    {/* Meta */}
    <p style={{ opacity: 0.8 }}>
      <strong>{job.company}</strong> — {job.location}
    </p>

    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        backgroundColor: "#222",
        marginTop: "8px",
      }}
    >
      {job.jobType}
    </span>

    <hr style={{ margin: "30px 0", borderColor: "#333" }} />

    {/* Description */}
    <h3>Description</h3>
    <p style={{ lineHeight: 1.6 }}>{job.description}</p>

    {/* Apply Section */}
    <div style={{ marginTop: "40px" }}>
      {alreadyApplied ? (
        <p style={{ color: "#4caf50", fontWeight: 500 }}>
          ✅ You have already applied for this job
        </p>
      ) : (
        <button
          onClick={handleApply}
          disabled={applying}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: applying ? "not-allowed" : "pointer",
          }}
        >
          {applying ? "Applying..." : "Apply for this job"}
        </button>
      )}
    </div>
  </div>
);

}
