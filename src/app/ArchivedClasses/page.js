"use client";

import React, { useState } from "react";

const ArchivedClasses = () => {
  const archivedClasses = [
    { id: 1, name: "Introduction to Programming - CS101", subject: "Archived notes and assignments" },
    { id: 2, name: "Discrete Mathematics - DM102", subject: "Archived lectures and practice questions" },
    { id: 3, name: "Data Structures - DS201", subject: "Archived quizzes and project files" },
  ];

  return (
    <div className="archived-classes p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Archived Classes</h1>
      <section className="courses-list grid gap-4">
        {archivedClasses.map((cls) => (
          <div
            key={cls.id}
            className="course-card p-4 bg-white rounded-md shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800">{cls.name}</h2>
              <p className="text-sm text-gray-500">{cls.subject}</p>
            </div>
            <button
              className="view-class-btn bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition-all"
            >
              View Class
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ArchivedClasses;
