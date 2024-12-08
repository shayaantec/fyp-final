"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons"; // Assuming you're using FontAwesome
import Classwork from "../Classwork/page"; // Import the Classwork component
import {uploadFileToS3} from '@/utils/s3';  
import { useSession } from 'next-auth/react';

export default function StudentStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { data: session } = useSession();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("stream"); // Default view is stream
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Store enrolled students here
  const [assignments, setAssignments] = useState([]); // Store assignments here
  const [selectedFiles, setSelectedFiles] = useState({}); // To manage selected files
const [uploading, setUploading] = useState(false); // To show upload status

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

    const fileUrl = await uploadFileToS3(file, fileName);  // Assuming uploadFileToS3 is defined and working

    // Submit to the backend API
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: session?.user?.id,  // Assuming you're using next-auth for session management
        assignmentId,
        fileUrl,
      }),
    });
    console.log(response)
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        alert(`Failed to submit: ${errorData.message}`);
      } else {
        const text = await response.text();
        console.error("Unexpected Response Text:", text);
        alert("Failed to submit due to an unexpected error.");
      }
      return;
    }

    const result = await response.json();
    console.log("Submission successful:", result);
    alert("File submitted successfully!");

    setSelectedFiles((prev) => {
      const updated = { ...prev };
      delete updated[assignmentId];
      return updated;
    });
  } catch (error) {
    console.error("Error during submission process:", error);
    alert("An error occurred while submitting the file.");
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    const fetchCourseAndAssignments = async () => {
      try {
        if (!courseId) {
          setError('Course ID is missing in the URL.');
          setLoading(false);
          return;
        }

        // Fetch course data
        const courseResponse = await fetch(`/api/get-classes?courseId=${courseId}`);
        if (!courseResponse.ok) {
          const errorData = await courseResponse.json();
          setError(errorData.message || 'Failed to fetch course data.');
          setLoading(false);
          return;
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch assignments for the course
        const assignmentsResponse = await fetch(`/api/get-assignments?courseId=${courseId}`);
        if (!assignmentsResponse.ok) {
          const errorData = await assignmentsResponse.json();
          setError(errorData.message || 'Failed to fetch assignments.');
        } else {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAssignments();
  }, [courseId]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
        Loading course details...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        {error}
      </p>
    );
  }

  if (!course) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
        No course found.
      </p>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          background: "linear-gradient(to right, #38b2ac, #4299e1)",
          color: "white",
          padding: "2rem",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          {course.name || "Course Name"}
        </h1>
        {/* <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
          {course.classCode || "Class Code"}
        </p> */}
      </header>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: currentView === "stream" ? "#4299e1" : "#f0f0f0",
            color: currentView === "stream" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => setCurrentView("stream")}
        >
          Stream
        </button>
        <button
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: currentView === "people" ? "#4299e1" : "#f0f0f0",
            color: currentView === "people" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => setCurrentView("people")}
        >
          People
        </button>

        {/* Add the Classwork Button */}
        <button
          onClick={() => setCurrentView("classwork")}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor:
              currentView === "classwork" ? "#4299e1" : "#f0f0f0",
            color: currentView === "classwork" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Classwork
        </button>
      </div>

      {/* Main Content */}
      <main>
        {currentView === "stream" && (
          <section
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Class Details
            </h3>
            {/* <p>
              <strong>Class Code:</strong> {course.classCode || "N/A"}
            </p> */}

            {/* Announcements Section */}
            <section
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginTop: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                }}
              >
                Announcements
              </h3>
              <ul style={{ marginTop: "0.5rem" }}>
                {course.announcements?.length > 0 ? (
                  course.announcements.map((announcement) => (
                    <li
                      key={announcement.id}
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "1rem",
                        borderRadius: "6px",
                        marginBottom: "0.5rem",
                        color: "#555",
                      }}
                    >
                      {announcement.text}
                    </li>
                  ))
                ) : (
                  <p style={{ color: "#999" }}>No announcements available.</p>
                )}
              </ul>
            </section>

            {/* Activities Section */}
            <section
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginTop: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                }}
              >
                Activities
              </h3>
              <ul>
                {course.activities?.length > 0 ? (
                  course.activities.map((activity) => (
                    <li
                      key={activity.id}
                      style={{
                        backgroundColor: "#f9f9f9",
                        padding: "1rem",
                        borderRadius: "6px",
                        marginBottom: "0.5rem",
                        color: "#555",
                        border: "1px solid #ddd",
                      }}
                    >
                      {activity.text}
                    </li>
                  ))
                ) : (
                  <p style={{ color: "#999" }}>No activities available.</p>
                )}
              </ul>
            </section>
            <section
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                }}
              >
                Assignments
              </h3>
              <ul>
                {assignments && assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <li
                      key={assignment.id}
                      style={{
                        position: "relative", // Create a relative position context for absolute positioning
                        padding: "1rem",
                        border: "1px solid #ddd",
                        marginBottom: "0.5rem",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                      }}
                    >
                      <strong>
                        <b>Title:</b>
                        {assignment.title}
                      </strong>
                      <p>{assignment.description}</p>

                      {/* Due Date */}
                      <small
                        style={{
                          position: "absolute", // Absolute positioning for right-alignment
                          top: "35%", // Position relative to parent container
                          right: "1rem", // Right aligned
                          transform: "translateY(-50%)",
                          fontSize: "0.9rem",
                          color: "green",
                        }}
                      >
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </small>

                      {/* View Attached File Link */}
                      {assignment.fileUrl && (
                        <p
                          style={{
                            position: "absolute",
                            top: "90%",

                            transform: "translateY(-50%)",
                            fontSize: "0.9rem",
                            color: "blue",
                          }}
                        >
                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Attached File
                          </a>
                        </p>
                      )}

                      {/* Submit File Button */}
                      <button
                        style={{
                          position: "absolute",
                          bottom: "5px", // Position at the bottom of the container

                          right: "0%", // Horizontally center the button

                          padding: "0.5rem 0.5rem", // Some padding for button size
                          fontSize: "0.9rem",
                          backgroundColor: "#4CAF50", // Green background for Submit button
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Optional: add shadow for depth
                        }}
                        onClick={() => handleSubmitFile(assignment.id)} // Trigger a submit file function when clicked
                        disabled={uploading}
                      >
                        {uploading ? "uploading.." : "submitted "}
                      </button>

                      {/* File Upload Input */}
                      <input
                        type="file"
                        style={{
                          position: "absolute",
                          bottom: "20px", // Align with the button
                          right: "10%", // Horizontally center the input
                          transform: "translateX(-50%)", // Adjust for exact centering
                       
                           // Hide it behind the button
                        }}
                        onChange={(e) => handleFileChange(e, assignment.id)} // Handle file change
                        
                      />
                    </li>
                  ))
                ) : (
                  <p style={{ color: "#999" }}>No assignments available.</p>
                )}
              </ul>
            </section>
          </section>
        )}

        {/* Render the Classwork Component when currentView is "classwork" */}
        {currentView === "classwork" && <Classwork />}

        {currentView === "people" && (
          <section
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              People in the Class
            </h3>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              {enrolledStudents?.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#4299e1",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "1rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    {enrollment.student.firstName[0]}
                    {enrollment.student.lastName[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", margin: 0, color: "#333" }}>
                      {enrollment.student.firstName}{" "}
                      {enrollment.student.lastName}
                    </p>
                    <p style={{ margin: 0, color: "#555", fontSize: "0.9rem" }}>
                      {enrollment.student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
