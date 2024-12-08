'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Tassignments from "../Tassignments/page"; // Import Tassignments component for assignments if needed
import Tgrades from "../Tgrades/page"; // Import Tgrades component for grades if needed

export default function TeacherStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudentsCardVisible, setStudentsCardVisible] = useState(false);
  const [currentView, setCurrentView] = useState('stream'); // Default view is stream
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Store enrolled students here
  const [assignments, setAssignments] = useState([]);

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
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>Loading course details...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;
  }

  if (!course) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>No course found.</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '1rem' }}>
      {/* Header Section */}
      <header
        style={{
          background: 'linear-gradient(to right, #38b2ac, #4299e1)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{course.name || 'Course Name'}</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{course.classCode || 'Class Code'}</p>
      </header>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: currentView === 'stream' ? '#4299e1' : '#f0f0f0',
            color: currentView === 'stream' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setCurrentView('stream')}
        >
          Stream
        </button>
        <button
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: currentView === 'assignments' ? '#4299e1' : '#f0f0f0',
            color: currentView === 'assignments' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setCurrentView('assignments')}
        >
          Assignments
        </button>
        <button
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: currentView === 'people' ? '#4299e1' : '#f0f0f0',
            color: currentView === 'people' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setCurrentView('people')}
        >
          People
        </button>
        <button
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: currentView === 'grades' ? '#4299e1' : '#f0f0f0',
            color: currentView === 'grades' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setCurrentView('grades')}
        >
          Grades
        </button>
      </div>

      {/* Main Content */}
      <main>
        {currentView === 'stream' && (
          <section
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              position: 'relative',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              Class Details
            </h3>
            <p>
              <strong>Class Code:</strong> {course.classCode || 'N/A'}
            </p>
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onClick={() => setStudentsCardVisible(true)}
            >
              Enrolled Students
            </button>

            {/* Announcements Section */}
            <section
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                Announcements
              </h3>
              <ul style={{ marginTop: '0.5rem' }}>
                {course.announcements?.length > 0 ? (
                  course.announcements.map((announcement) => (
                    <li
                      key={announcement.id}
                      style={{
                        backgroundColor: '#f0f0f0',
                        padding: '1rem',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        color: '#555',
                      }}
                    >
                      {announcement.text}
                    </li>
                  ))
                ) : (
                  <p style={{ color: '#999' }}>No announcements available.</p>
                )}
              </ul>
            </section>

            {/* Activities Section */}
            <section
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                Activities
              </h3>
              <ul>
                {course.activities?.length > 0 ? (
                  course.activities.map((activity) => (
                    <li
                      key={activity.id}
                      style={{
                        backgroundColor: '#f9f9f9',
                        padding: '1rem',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        color: '#555',
                        border: '1px solid #ddd',
                      }}
                    >
                      {activity.text}
                    </li>
                  ))
                ) : (
                  <p style={{ color: '#999' }}>No activities available.</p>
                )}
              </ul>
            </section>
            <section
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              Assignments
            </h3>
            <ul>
              {assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '1rem',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      color: '#555',
                      border: '1px solid #ddd',
                    }}
                  >
                    <strong><b>Title:</b>{assignment.title}</strong>
                    <p>{assignment.description}</p>
                    <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                    {assignment.fileUrl && (
                      <p>
                        <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                          View Attached File
                        </a>
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <p style={{ color: '#999' }}>No assignments available.</p>
              )}
            </ul>
          </section>
          </section>

          
        )}

        {currentView === 'assignments' && (
          <Tassignments courseId={courseId} />
        )}

        {currentView === 'people' && (
          <section
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              People
            </h3>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              {enrolledStudents?.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#4299e1',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      marginRight: '1rem',
                      fontSize: '1.2rem',
                    }}
                  >
                    {enrollment.student.firstName[0]}
                    {enrollment.student.lastName[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>
                      {enrollment.student.firstName} {enrollment.student.lastName}
                    </p>
                    <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
                      {enrollment.student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentView === 'grades' && (
          <Tgrades courseId={courseId} />
        )}
      </main>

      {/* Enrolled Students Card */}
      {isStudentsCardVisible && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
              Enrolled Students
            </h2>
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => setStudentsCardVisible(false)}
            >
              Close
            </button>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              {enrolledStudents?.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#4299e1',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      marginRight: '1rem',
                      fontSize: '1.2rem',
                    }}
                  >
                    {enrollment.student.firstName[0]}
                    {enrollment.student.lastName[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>
                      {enrollment.student.firstName} {enrollment.student.lastName}
                    </p>
                    <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
                      {enrollment.student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
