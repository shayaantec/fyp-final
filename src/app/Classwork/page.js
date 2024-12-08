'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import {uploadFileToS3} from '@/utils/s3';  
export default function Classwork() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { data: session } = useSession();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsResponse = await fetch(`/api/get-assignments?courseId=${courseId}`);
        
        if (!assignmentsResponse.ok) {
          const errorData = await assignmentsResponse.json();
          setError(errorData.message || 'Failed to fetch assignments.');
        } else {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData);
        }
      } catch (err) {
        setError('An error occurred while fetching assignments.');
      }
    };

    const fetchSubmissions = async () => {
      try {
        // Ensure studentId and courseId are correctly passed
        if (session?.user?.id && courseId) {
          const submissionsResponse = await fetch(
            `/api/get-submissions?courseId=${courseId}&studentId=${session?.user?.id}`
          );

          console.log("Fetching submissions for courseId:", courseId, " studentId:", session?.user?.id);

          if (!submissionsResponse.ok) {
            const errorData = await submissionsResponse.json();
            setError(errorData.message || 'Failed to fetch submissions.');
          } else {
            const submissionsData = await submissionsResponse.json();
            setSubmissions(submissionsData);
            console.log("Submissions fetched:", submissionsData);
          }
        }
      } catch (err) {
        setError('An error occurred while fetching submissions.');
      }
    };

    fetchAssignments();
    if (session?.user?.id) {
      fetchSubmissions();
    }
  }, [courseId, session?.user?.id]);

  // Helper function to format the date range
  const formatWeek = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start of the week
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week

    const options = { month: 'short', day: 'numeric' };
    return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString(
      'en-US',
      options
    )}, ${startOfWeek.getFullYear()}`;
  };

  // Handlers to navigate weeks
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="classwork-container">
      <header className="classwork-header">
        <h2 className="classwork-title">To-Do List</h2>
        <div className="date-navigation">
          <button className="prev-week" onClick={handlePreviousWeek}>
            &lt;
          </button>
          <span className="current-week">{formatWeek(currentDate)}</span>
          <button className="next-week" onClick={handleNextWeek}>
            &gt;
          </button>
        </div>
      </header>
      <main className="classwork-content">
        <div className="classwork-section assigned">
          <h3>Assigned</h3>
          <ul>
            {assignments && assignments.length > 0 ? (
              assignments.map((assignment) => (
                <li key={assignment.id}>
                  <div className="task-title">{assignment.title}</div>
                  <div className="task-details">{assignment.description}</div>
                  <div className="task-date">{assignment.dueDate}</div>
                </li>
              ))
            ) : (
              <li>No assigned tasks</li>
            )}
          </ul>
        </div>

        <div className="classwork-section missing">
          <h3>Missing</h3>
          <ul>
            <li>No missing tasks</li>
          </ul>
        </div>

        <div className="classwork-section done">
  <h3>Done</h3>
  <ul>
    {submissions && submissions.length > 0 ? (
      submissions.map((submission) => (
        <li key={submission.id}>  {/* Ensure 'submission.id' is unique */}
          <div className="submission-title">Assignment: {submission.assignment.title}</div>
          <div className="submission-details">
            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
              View Submitted File
            </a>
          </div>
          <div className="submission-time">
            Submitted At: {new Date(submission.submittedAt).toLocaleString()}
          </div>
        </li>
      ))
    ) : (
      <li>No completed tasks</li>
    )}
  </ul>
</div>
      </main>
    </div>
  );
}
