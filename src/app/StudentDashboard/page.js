'use client';

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faFolder,
  faChartBar,
  faComments,
  faSignOutAlt,
  faChevronDown,
  faChevronRight,
  faArchive,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

import EnrollClass from "../EnrollClass/page";
import ViewGrades from "../ViewGrades/page";
import Classwork from "../Classwork/page";
import ViewAssignment from "../ViewAssignment/page";
import ViewQuizAssignment from "../ViewQuizAssignment/page";
import Forum from "../Forum/page";
import ArchivedClasses from "../ArchivedClasses/page";  // Import Archived classes component
import Settings from "../Settings/page";  // Import Settings component

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [assignmentsExpanded, setAssignmentsExpanded] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    if (!session) return;

    const fetchEnrolledClasses = async () => {
      try {
        const response = await fetch(
          `/api/enrolled-classes?studentId=${session.user.id}`
        );
        const classes = await response.json();
        setEnrolledClasses(classes.map((e) => e.class));
      } catch (err) {
        console.error("Failed to fetch enrolled classes:", err);
      }
    };

    fetchEnrolledClasses();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleEnrollClick = () => {
    setShowEnrollModal(true);
  };

  const handleCloseModal = () => {
    setShowEnrollModal(false);
  };

  // Unenroll from a class
  const handleUnenroll = async (classId) => {
    try {
      const response = await fetch(`/api/unenroll-class`, {
        method: 'DELETE', // DELETE method for unenroll
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classId,
          studentId: session.user.id, // Passing studentId from session
        }),
      });

      if (response.ok) {
        // Remove the class from the enrolledClasses state after successful unenrollment
        setEnrolledClasses(enrolledClasses.filter((cls) => cls.id !== classId));
      } else {
        const data = await response.json();
        console.error('Unenrollment failed:', data.message);
        alert('Failed to unenroll from class. Please try again later.');
      }
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert('An error occurred while unenrolling. Please try again later.');
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return <p>You need to log in to access the dashboard.</p>;
  }

  return (
    <div className="student-dashboard main-container flex min-h-screen relative">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-gradient-to-b from-[#F9F7F7] to-[#E8F7E8] text-gray-800 p-6 flex flex-col justify-between rounded-r-2xl shadow-lg">
        <div>
          <div className="logo-container mb-8 flex flex-col items-center">
            <img
              src="/Logo.png"
              alt="LeetConnect Logo"
              className="logo-image w-28 mx-auto mb-4"
            />
            <h2 className="text-center font-bold text-xl">
              {session?.user?.name}
            </h2>
          </div>
          <nav className="menu">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentView === "dashboard"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faHome} className="text-xl" />
                  Home
                </button>
              </li>
              {/* Additional navigation items */}
              <li>
                <div>
                  <button
                    onClick={() => setAssignmentsExpanded(!assignmentsExpanded)}
                    className="menu-item flex items-center justify-between gap-4 w-full text-lg py-2 px-4 rounded-md hover:bg-[#E8F7E8] transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <FontAwesomeIcon icon={faFolder} className="text-xl" />
                      Assignments
                    </span>
                    <FontAwesomeIcon
                      icon={assignmentsExpanded ? faChevronDown : faChevronRight}
                      className="text-sm"
                    />
                  </button>
                  {assignmentsExpanded && (
                    <ul className="submenu mt-2 space-y-2 pl-8">
                      <li>
                        <button
                          onClick={() => setCurrentView("viewassignments")}
                          className="submenu-item text-gray-800 text-base hover:text-teal-500 transition-colors"
                        >
                          📄 View Assignments
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setCurrentView("viewquizassignments")}
                          className="submenu-item text-gray-800 text-base hover:text-teal-500 transition-colors"
                        >
                          📝 View Quiz Assignments
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("viewgrades")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentView === "viewgrades"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faChartBar} className="text-xl" />
                  View Grades
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("forum")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentView === "forum"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faComments} className="text-xl" />
                  Forum
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("archived")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentView === "archived"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faArchive} className="text-xl" />
                  Archived
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("settings")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentView === "settings"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faCog} className="text-xl" />
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white text-lg font-bold py-2 px-4 rounded-md shadow-lg flex items-center gap-2 transition-colors"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
        Sign Out
      </button>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-grow bg-gray-100 p-8 rounded-l-2xl shadow-inner">
        {currentView === "dashboard" && (
          <>
            <div className="top-bar sticky top-0 z-10 bg-gray-100 shadow-md p-4 mb-8">
              <div className="search-container flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input flex-grow py-2 px-4 border border-gray-300 rounded-md shadow-sm"
                />
                <button
                  className="enroll-btn ml-4 bg-teal-500 text-white py-2 px-6 rounded-md font-bold hover:bg-teal-600 transition-colors"
                  onClick={handleEnrollClick}
                >
                  Enroll
                </button>
              </div>
            </div>
            <section className="courses-list grid gap-4">
              {enrolledClasses.length > 0 ? (
                enrolledClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="course-card p-4 bg-white rounded-md shadow-md hover:shadow-lg transition-colors flex justify-between items-center"
                  >
                    <div>
                      <h2 className="course-title text-xl font-bold">
                        {cls.name} - {cls.subject}
                      </h2>
                      <p className="course-description text-gray-500">
                        Assignments, announcements, and materials
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="go-to-class-btn bg-teal-500 text-white py-2 px-4 rounded-md font-bold hover:bg-teal-600 transition-colors"
                        onClick={() =>
                          router.push(`/StudentStream?courseId=${cls.id}`)
                        }
                      >
                        View Class
                      </button>
                      <button
                        className="unenroll-btn bg-red-500 text-white py-2 px-4 rounded-md font-bold hover:bg-red-600 transition-colors"
                        onClick={() => handleUnenroll(cls.id)}
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-classes-message text-center text-gray-500">
                  No classes enrolled. Use the Enroll button to join a class.
                </p>
              )}
            </section>
          </>
        )}
        {currentView === "viewgrades" && <ViewGrades />}
        {currentView === "viewassignments" && <ViewAssignment />}
        {currentView === "viewquizassignments" && <ViewQuizAssignment />}
        {currentView === "forum" && <Forum />}
        {currentView === "archived" && <ArchivedClasses />}
        {currentView === "settings" && <Settings />}
          
      </main>


      {showEnrollModal && <EnrollClass onClose={handleCloseModal} />}
    </div>
  );
}
