"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: number;
  appliedAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
  };
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view your applications.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/applications/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await res.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading applications...</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  }

  if (applications.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Applications</h2>
        <p>You have not applied to any jobs yet.</p>
        <Link href="/jobs">Browse Jobs</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, maxWidth: 900 }}>
      <h2>My Applications</h2>

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            borderBottom: "1px solid #444",
            padding: "15px 0",
          }}
        >
          <h3>{app.job.title}</h3>

          <p>
            <strong>Company:</strong> {app.job.company}
          </p>
          <p>
            <strong>Location:</strong> {app.job.location}
          </p>
          <p>
            <strong>Job Type:</strong> {app.job.jobType}
          </p>
          <p>
            <strong>Applied On:</strong>{" "}
            {new Date(app.appliedAt).toLocaleDateString()}
          </p>

          <Link href={`/jobs/${app.job.id}`}>
            View Job
          </Link>
        </div>
      ))}
    </div>
  );
}
