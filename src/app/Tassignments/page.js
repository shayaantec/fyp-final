"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uploadFileToS3 } from "@/utils/s3";

export default function Tassignments({ courseId }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [file, setFile] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const onSubmitAssignment = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!courseId || !title || !dueDate || !file) {
      setError("All fields are required except optional ones");
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload file to S3
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = await uploadFileToS3(file, fileName);
      if (!fileUrl) throw new Error("File upload failed");

      const assignmentData = {
        title,
        description,
        dueDate: dueDate.toISOString(),
        classId: parseInt(courseId, 10),
        fileUrl,
      };

      const res = await fetch("/api/Tassignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await res.json();
          throw new Error(result.message || "Failed to create assignment");
        } else {
          throw new Error("Unexpected response format. Please check the API.");
        }
      }

      const result = await res.json();
      alert("Assignment created successfully!");
      closeModal();
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "An error occurred while creating the assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (option) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOption("");
    setFile(null);
    setDueDate(null);
  };

  return (
    <div className="tassignments-content">
      <div className="tassignments-card-container">
        {/* Assignment Card */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📄</div>
          <h3 className="tassignments-card-title">Assignment</h3>
          <p className="tassignments-card-description">Create an assignment portal</p>
          <button className="tassignments-create-btn" onClick={() => openModal("Assignment")}>
            Create +
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="create-assignment-modal-overlay">
          <div className="create-assignment-modal">
            <h2 className="create-assignment-modal-title">Create Assignment</h2>
            <form className="create-assignment-modal-form" onSubmit={onSubmitAssignment}>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="create-assignment-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Instructions (optional)</label>
                <textarea
                  className="create-assignment-input"
                  placeholder="Instructions"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label>Attach Task</label>
                <input type="file" className="create-assignment-input" onChange={handleFileChange} required />
                {file && <p>File: {file.name}</p>}
              </div>

              <div>
                <label>Due Date</label>
                <DatePicker
                  selected={dueDate}
                  onChange={handleDateChange}
                  className="create-assignment-input"
                  placeholderText="Select a due date"
                  dateFormat="MMMM d, yyyy"
                  required
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="create-assignment-modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="assign-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Assigning..." : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
