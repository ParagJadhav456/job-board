"use client";


import {useEffect, useState} from "react";

type Job={
    id:number;
    title: string;
    company: string;
    location: string;
    jobType: string;
};

export default function JobsPage(){
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/jobs")
        .then((res) => res.json())
        .then((data) => {
            setJobs(data);
            setLoading(false);
        });
    },[]);
    
    if (loading) return <p>Loading jobs...</p>;
    return(
        <div style={{ padding:"20px"}}>
            <h1>Job Listing</h1>

            <ul>
                {jobs.map((job)=>(
                    <li key={job.id} style={{ marginBottom: "10px"}}>
                        <strong>{job.title}</strong> - {job.company} ({job.location})
                        </li>
                ))}
            </ul>
        </div>
    );
}