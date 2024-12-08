"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faArchive,
  faCog,
  faEnvelope,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import CreateClass from "../CreateClass/page";
import ArchivedClasses from "../ArchivedClasses/page";
import Settings from "../Settings/page";
import Messages from "../Messages/page"; // Import the Messages component

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const fetchClasses = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/get-classes?teacherId=${session.user.id}`);
      if (!response.ok) {
        console.log("Failed to fetch classes");
        return;
      }
      const data = await response.json();
      setClasses(data.classes);
    } catch (error) {
      console.log("Error fetching classes:", error);
    }
  };

  const handleClassCreated = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchClasses();
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You need to log in to access this dashboard.</p>;
  }

  return (
    <div className="main-container flex min-h-screen relative">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-gradient-to-b from-[#F9F7F7] to-[#E8F7E8] text-gray-800 p-6 flex flex-col justify-between rounded-r-2xl shadow-lg">
        <div>
          {/* Logo and Profile Section */}
          <div className="logo-container mb-8 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="LeetConnect Logo"
              className="logo-image w-32 h-auto mb-4"
            />
            <img
              src="https://via.placeholder.com/120"
              alt={session?.user?.name || "Profile Image"}
              className="profile-image w-24 h-24 rounded-full mb-4 shadow-md"
            />
            <h2 className="text-gray-900 text-xl font-bold text-center">
              {session?.user?.name}
            </h2>
          </div>
          {/* Navigation Menu */}
          <nav className="menu">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentPage === "dashboard"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faHome} className="text-xl" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("archived")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentPage === "archived"
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
                  onClick={() => setCurrentPage("messages")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentPage === "messages"
                      ? "bg-teal-500 text-white"
                      : "hover:bg-[#E8F7E8]"
                  } transition-colors`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                  Messages
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("settings")}
                  className={`menu-item flex items-center gap-4 w-full text-lg py-2 px-4 rounded-md ${
                    currentPage === "settings"
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
      </aside>

      {/* Main Content */}
      <main className="main-content flex-grow bg-gray-100 p-8 rounded-l-2xl shadow-inner">
        {currentPage === "dashboard" && (
          <div>
            <div className="title-bar flex justify-between items-center mb-6">
              <h1 className="section-title text-2xl font-bold text-teal-600">
                Your Courses
              </h1>
              <button
                className="create-class-btn bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-600 transition-all"
                onClick={() => setModalOpen(true)}
              >
                Create Class
              </button>
            </div>
            <section className="courses-list grid gap-6">
              {classes.length > 0 ? (
                classes.map((course) => (
                  <div
                    key={course.id}
                    className="course-card p-4 border rounded-lg shadow-md hover:shadow-lg transition-all bg-white"
                  >
                    <div>
                      <h2 className="course-title text-lg font-bold text-gray-800">
                        {course.name} ({course.classCode})
                      </h2>
                      <p className="course-description text-sm text-gray-600">
                        {course.subject} - Section: {course.section} - Room:{" "}
                        {course.room}
                      </p>
                    </div>
                    <button
                      className="go-to-class-btn mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-600 transition-all"
                      onClick={() =>
                        router.push(`/TeacherStream?courseId=${course.id}`)
                      }
                    >
                      Go to Class
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-classes-message text-center text-gray-600">
                  You have no classes. Create one using the button above.
                </p>
              )}
            </section>
            {isModalOpen && (
              <CreateClass
                teacherId={session.user.id}
                onClassCreated={handleClassCreated}
              />
            )}
          </div>
        )}
        {currentPage === "archived" && <ArchivedClasses />}
        {currentPage === "messages" && <Messages />} {/* Render Messages Component */}
        {currentPage === "settings" && <Settings />} {/* Render Settings Component */}
      </main>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="signout-btn fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition-all"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        Sign Out
      </button>
    </div>
  );
}
