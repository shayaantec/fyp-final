'use client';

import React, { useState } from 'react';

export default function CreateClass({ teacherId, onClassCreated }) {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    subject: '',
    room: '',
  });
  const [classCode, setClassCode] = useState(null); // Store the generated class code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, teacherId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create class');
        return;
      }

      const data = await response.json();
      setClassCode(data.classCode); // Save the generated class code
      onClassCreated(data.class); // Notify the parent component about the new class
    } catch (err) {
      setError('An error occurred while creating the class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={styles.modalOverlay}>
      <div className="modal" style={styles.modal}>
        <h2 className="modal-title" style={styles.modalTitle}>Create Class</h2>

        {classCode ? (
          <div className="success-message" style={styles.successMessage}>
            <p>Class successfully created!</p>
            <p>
              Your class code: <strong>{classCode}</strong>
            </p>
            <button className="create-btn" style={styles.createBtn} onClick={() => onClassCreated(null)}>
              Done
            </button>
          </div>
        ) : (
          <form className="modal-form" style={styles.modalForm} onSubmit={handleSubmit}>
            <label className="form-label" style={styles.formLabel}>
              Class Name (required)
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                className="form-input"
                style={styles.formInput}
                placeholder="Enter class name"
                required
              />
            </label>
            <label className="form-label" style={styles.formLabel}>
              Section
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="form-input"
                style={styles.formInput}
                placeholder="Enter section"
              />
            </label>
            <label className="form-label" style={styles.formLabel}>
              Subject
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                style={styles.formInput}
                placeholder="Enter subject"
              />
            </label>
            <label className="form-label" style={styles.formLabel}>
              Room
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="form-input"
                style={styles.formInput}
                placeholder="Enter room"
              />
            </label>

            {error && <p className="error-message" style={styles.errorMessage}>{error}</p>}

            <div className="form-actions" style={styles.formActions}>
              <button type="button" className="cancel-btn" style={styles.cancelBtn} onClick={() => onClassCreated(null)}>
                Cancel
              </button>
              <button type="submit" className="create-btn" style={styles.createBtn} disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    padding: '20px',
    position: 'relative',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formLabel: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  cancelBtn: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  createBtn: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMessage: {
    textAlign: 'center',
  },
};
