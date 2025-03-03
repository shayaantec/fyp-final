"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // ✅ Allow assignments to be clickable
import Tassignments from "../Tassignments/page";
import Tgrades from "../Tgrades/page";

export default function TeacherStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("stream");
  const [streamItems, setStreamItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      if (!courseId) {
        setError("Course ID is missing in the URL.");
        setLoading(false);
        return;
      }

      const streamResponse = await fetch(`/api/get-streams?classId=${courseId}`);
      if (!streamResponse.ok) throw new Error("Failed to fetch stream");

      const streamData = await streamResponse.json();
      setStreamItems(streamData);
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStream = async () => {
    try {
      const response = await fetch(`/api/get-streams?classId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch stream updates");

      const streamData = await response.json();
      setStreamItems(streamData);
    } catch (error) {
      console.error("Error fetching stream updates:", error);
    }
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <header>
        <h1>{course?.name || "Course Name"}</h1>
      </header>

      <nav>
        <button onClick={() => setCurrentView("stream")}>Stream</button>
        <button onClick={() => setCurrentView("assignments")}>Assignments</button>
        <button onClick={() => setCurrentView("grades")}>Grades</button>
      </nav>

      {currentView === "stream" && (
        <section>
          <h3>Class Stream</h3>
          <ul>
            {streamItems.length > 0 ? (
              streamItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>

                  {item.fileUrl && (
                    <p>
                      <a href={item.fileUrl} target="_blank">
                        View File
                      </a>
                    </p>
                  )}

                  {item.assignmentId && (
                    <p>
                      <Link href={`/assignments/${item.assignmentId}`}>
                        <button>Go to Assignment Portal</button>
                      </Link>
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p>No stream items available.</p>
            )}
          </ul>
        </section>
      )}

      {currentView === "assignments" && <Tassignments courseId={courseId} refreshStream={refreshStream} />}
      {currentView === "grades" && <Tgrades courseId={courseId} />}
    </div>
  );
}
