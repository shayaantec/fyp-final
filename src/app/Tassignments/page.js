'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {uploadFileToS3} from '@/utils/s3';  

export default function Tassignments({ courseId }) {
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [selectedOption, setSelectedOption] = useState(''); // State to track selected card
  const [file, setFile] = useState(null); // State to store file
  const [dueDate, setDueDate] = useState(null); // State to store due date
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  //const [courseId, setCourseId] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const onSubmitAssignment = async (e) => {
    e.preventDefault();
  
    // Validate inputs
   // Validate inputs
  if (!courseId || !title || !dueDate || !file) {
    setError('All fields are required except optional ones');
    return;
  }

  try {
    // Upload file to S3
    const fileName = `${Date.now()}-${file.name}`; // Unique file name
    const fileUrl = await uploadFileToS3(file, fileName);

    // Prepare assignment data
    const assignmentData = {
      title,
      description,
      dueDate: dueDate.toISOString(), // Convert Date object to ISO string
      classId: parseInt(courseId, 10), // Ensure the ID is sent as a number
      fileUrl, // S3 file URL
    };

    // Send assignment data to the backend
    const res = await fetch('/api/Tassignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData),
    });

    if (res.ok) {
      alert('Assignment created successfully');
      closeModal(); // Close modal on success
    } else {
      const result = await res.json();
      setError(result.message || 'Failed to create assignment');
    }
  } catch (err) {
    setError('An error occurred while creating the assignment');
    console.error(err);
  }
};
  

  const openModal = (option) => {
    setSelectedOption(option); // Set the selected card (e.g., Assignment, Quiz Assignment)
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal
    setSelectedOption(''); // Reset the selected card
    setFile(null); // Reset file state
    setDueDate(null)
  };


  const renderModalContent = () => {
    // Customize modal content based on the selected option
    switch (selectedOption) {
      case 'Assignment':
        return (
          <>
            <h2 className="create-assignment-modal-title">Create Assignment</h2>
            <form className="create-assignment-modal-form" onSubmit={onSubmitAssignment}>
              {/* <div>
                <label>Select course</label>
                <select
                  className="create-assignment-input"
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="" disabled>Select course...</option>
                  {courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No courses available</option>
                  )}
                </select>
              </div> */}

              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="create-assignment-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                <input
                  type="file"
                  className="create-assignment-input"
                  onChange={handleFileChange}
                  required
                />
                {file && <p>File: {file.name}</p>}
              </div>

              <div>
                <label>Assign to</label>
                <select className="create-assignment-input">
                  <option value="all">All students</option>
                </select>
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

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <div className="create-assignment-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="assign-btn">
                  Assign
                </button>
              </div>
            </form>
          </>
        );
      case 'Quiz Assignment':
        return (
          <>
            <h2 className="create-assignment-modal-title">Create Quiz Assignment</h2>
            <form className="create-assignment-modal-form">
              <div>
                <label>Select course</label>
                <select className="create-assignment-input" required>
                  <option value="" disabled>Select course...</option>
                  {courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No courses available</option>
                  )}
                </select>
              </div>
              <div>
                <label>Quiz Title</label>
                <input
                  type="text"
                  className="create-assignment-input"
                  placeholder="Quiz Title"
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="create-assignment-input"
                  placeholder="Quiz Description"
                ></textarea>
              </div>
              <div>
                <label>Attach</label>
                <div className="create-assignment-attachments">
                  <button type="button">📄 Google Drive</button>
                  <button type="button">🎥 YouTube</button>
                  <button type="button">➕ Create</button>
                  <button type="button">📤 Upload</button>
                  <button type="button">🔗 Link</button>
                </div>
              </div>
              <div>
                <label>Assign to</label>
                <select className="create-assignment-input">
                  <option value="all">All students</option>
                </select>
              </div>
              <div>
                <label>Due</label>
                <select className="create-assignment-input">
                  <option value="" disabled>No Due Date</option>
                </select>
              </div>
              <div className="create-assignment-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="assign-btn">
                  Assign
                </button>
              </div>
            </form>
          </>
        );
      case 'Material':
        return (
          <>
            <h2 className="create-assignment-modal-title">Upload Material</h2>
            <form className="create-assignment-modal-form">
              <div>
                <label>Select course</label>
                <select className="create-assignment-input">
                  <option value="" disabled>Select course...</option>
                  {courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No courses available</option>
                  )}
                </select>
              </div>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="create-assignment-input"
                  placeholder="Material Title"
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="create-assignment-input"
                  placeholder="Material Description"
                ></textarea>
              </div>
              <div>
                <label>Attach</label>
                <div className="create-assignment-attachments">
                  <button type="button">📄 Google Drive</button>
                  <button type="button">🎥 YouTube</button>
                  <button type="button">📤 Upload</button>
                  <button type="button">🔗 Link</button>
                </div>
              </div>
              <div>
                <label>Assign to</label>
                <select className="create-assignment-input">
                  <option value="all">All students</option>
                </select>
              </div>
              <div className="create-assignment-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="assign-btn">
                  Upload
                </button>
              </div>
            </form>
          </>
        );
      case 'Question':
        return (
          <>
            <h2 className="create-assignment-modal-title">Create Question</h2>
            <form className="create-assignment-modal-form">
              <div>
                <label>Select course</label>
                <select className="create-assignment-input">
                  <option value="" disabled>Select course...</option>
                  {courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No courses available</option>
                  )}
                </select>
              </div>
              <div>
                <label>Question</label>
                <textarea
                  className="create-assignment-input"
                  placeholder="Write your question here..."
                ></textarea>
              </div>
              <div>
                <label>Attach</label>
                <div className="create-assignment-attachments">
                  <button type="button">📄 Google Drive</button>
                  <button type="button">📤 Upload</button>
                  <button type="button">🔗 Link</button>
                </div>
              </div>
              <div>
                <label>Assign to</label>
                <select className="create-assignment-input">
                  <option value="all">All students</option>
                </select>
              </div>
              <div className="create-assignment-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="assign-btn">
                  Submit
                </button>
              </div>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tassignments-content">
      <div className="tassignments-card-container">
        {/* Assignment Card */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📄</div>
          <h3 className="tassignments-card-title">Assignment</h3>
          <p className="tassignments-card-description">
            Create an assignment portal
          </p>
          <button
            className="tassignments-create-btn"
            onClick={() => openModal('Assignment')}
          >
            Create +
          </button>
        </div>

        {/* Quiz Assignment Card */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📝</div>
          <h3 className="tassignments-card-title">Quiz Assignment</h3>
          <p className="tassignments-card-description">
            Create a quiz assignment portal
          </p>
          <button
            className="tassignments-create-btn"
            onClick={() => openModal('Quiz Assignment')}
          >
            Create +
          </button>
        </div>

        {/* Material Card */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📂</div>
          <h3 className="tassignments-card-title">Material</h3>
          <p className="tassignments-card-description">
            Upload a material for students
          </p>
          <button
            className="tassignments-create-btn"
            onClick={() => openModal('Material')}
          >
            Create +
          </button>
        </div>

        {/* Question Card */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">❓</div>
          <h3 className="tassignments-card-title">Question</h3>
          <p className="tassignments-card-description">
            Create a question for students
          </p>
          <button
            className="tassignments-create-btn"
            onClick={() => openModal('Question')}
          >
            Create +
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="create-assignment-modal-overlay">
          <div className="create-assignment-modal">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}


