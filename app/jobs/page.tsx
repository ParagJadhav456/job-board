"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);
  if (loading) {
      return <p style={{ padding: 20 }}>Loading jobs...</p>;
    }

    if (error) {
      return (
        <p style={{ padding: 20, color: "red" }}>
          ❌ {error}
        </p>
      );
    }

    if (jobs.length === 0) {
      return (
        <p style={{ padding: 20, opacity: 0.7 }}>
          📭 No jobs available right now
        </p>
      );
    }
  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>Job Openings</h1>

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Title */}
          <h3 style={{ marginBottom: "5px" }}>
            {job.title}
          </h3>

          {/* Meta */}
          <p style={{ opacity: 0.8 }}>
            {job.company} — {job.location}
          </p>

          {/* Job type badge */}
          <span
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              backgroundColor: "#222",
            }}
          >
            {job.jobType}
          </span>

          {/* CTA */}
          <div style={{ marginTop: "15px" }}>
            <Link href={`/jobs/${job.id}`}>
              <button style={{ padding: "8px 14px" }}>
                View Job
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
);
}
