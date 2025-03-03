"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import Classwork from "../Classwork/page"; // Import Classwork component
import { uploadFileToS3 } from '@/utils/s3';

export default function StudentStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { data: session } = useSession();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("stream"); 
  const [assignments, setAssignments] = useState([]); 
  const [streamItems, setStreamItems] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!courseId) {
          setError("Course ID is missing in the URL.");
          setLoading(false);
          return;
        }

        // Fetch course details
        const courseResponse = await fetch(`/api/get-classes?courseId=${courseId}`);
        if (!courseResponse.ok) {
          setError("Failed to fetch course data.");
          setLoading(false);
          return;
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch assignments
        const assignmentsResponse = await fetch(`/api/get-assignments?courseId=${courseId}`);
        if (!assignmentsResponse.ok) {
          setAssignments([]);
        } else {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData);
        }

        // Fetch stream items (Announcements, Assignments, Activities)
        const streamResponse = await fetch(`/api/get-streams?classId=${courseId}`);
        if (!streamResponse.ok) {
          setStreamItems([]);
        } else {
          const streamData = await streamResponse.json();
          setStreamItems(streamData);
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleFileChange = (e, assignmentId) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  const handleSubmitFile = async (assignmentId) => {
    if (!selectedFiles[assignmentId]) {
      alert("Please select a file before submitting.");
      return;
    }

    setUploading(true);
    try {
      const file = selectedFiles[assignmentId];
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = await uploadFileToS3(file, fileName);  

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: session?.user?.id,  
          assignmentId,
          fileUrl,
        }),
      });

      if (!response.ok) {
        alert("Failed to submit.");
        return;
      }

      alert("File submitted successfully!");

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[assignmentId];
        return updated;
      });
    } catch (error) {
      alert("An error occurred while submitting the file.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>Loading course details...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;
  }

  if (!course) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>No course found.</p>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "1rem" }}>
      <header style={{
          background: "linear-gradient(to right, #38b2ac, #4299e1)",
          color: "white",
          padding: "2rem",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "2rem",
        }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{course.name || "Course Name"}</h1>
      </header>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button style={{ padding: "0.8rem 2rem", backgroundColor: currentView === "stream" ? "#4299e1" : "#f0f0f0" }} onClick={() => setCurrentView("stream")}>Stream</button>
        <button style={{ padding: "0.8rem 2rem", backgroundColor: currentView === "people" ? "#4299e1" : "#f0f0f0" }} onClick={() => setCurrentView("people")}>People</button>
        <button style={{ padding: "0.8rem 2rem", backgroundColor: currentView === "classwork" ? "#4299e1" : "#f0f0f0" }} onClick={() => setCurrentView("classwork")}>Classwork</button>
      </div>

      <main>
        {currentView === "stream" && (
          <section style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#333" }}>Class Stream</h3>
            <ul>
              {streamItems.length > 0 ? (
                streamItems.map((item) => (
                  <li key={item.id} style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid #ddd" }}>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    {item.fileUrl && (
                      <p>
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">View Attached File</a>
                      </p>
                    )}
                    <small>Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</small>
                  </li>
                ))
              ) : (
                <p style={{ color: "#999" }}>No stream items available.</p>
              )}
            </ul>
          </section>
        )}

        {currentView === "classwork" && <Classwork />}
      </main>
    </div>
  );
}
