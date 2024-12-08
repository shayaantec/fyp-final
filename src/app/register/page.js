"use client";

import { useState, useEffect } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    CNIC: "",
    age: "",
    gender: "male", // Default gender
    role: "student", // Default role
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationStage, setIsVerificationStage] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(30); // Timer for resend button
  const [canResend, setCanResend] = useState(false); // Control resend button availability

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Timer management for Resend Code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Validate Email using backend API
  const validateEmail = async (email) => {
    try {
      const response = await fetch("/api/auth/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { isValid: false, message: errorData.message || "Invalid email address" };
      }

      const data = await response.json();
      if (data.isValid) {
        return { isValid: true, message: "Email is valid" };
      } else if (data.isDisposable) {
        return { isValid: false, message: "Disposable emails are not allowed" };
      } else {
        return { isValid: false, message: "Invalid email address" };
      }
    } catch (error) {
      return { isValid: false, message: "Failed to validate email" };
    }
  };

  // Handle Registration Form Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setValidationMessage("");
    setIsSubmitting(true);

    // Step 1: Validate the email
    const emailValidationResult = await validateEmail(formData.email);
    setValidationMessage(emailValidationResult.message);

    if (!emailValidationResult.isValid) {
      setIsSubmitting(false);
      return; // Stop further processing if email is invalid
    }

    // Step 2: Proceed with registration
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setValidationMessage(result.message || "A 4-digit code has been sent to your email.");
      if (response.ok) {
        setIsVerificationStage(true);
        setTimer(30); // Reset timer for resend code
        setCanResend(false);
      }
    } catch (error) {
      setValidationMessage("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Verification Code Submission
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setValidationMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });

      const result = await response.json();
      setValidationMessage(result.message || "Verification successful!");
      if (response.ok) window.location.href = result.redirectUrl; // Redirect after successful verification
    } catch (error) {
      setValidationMessage("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend Code
  const handleResendCode = async () => {
    setValidationMessage("");
    try {
      const response = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      setValidationMessage(result.message || "A new code has been sent to your email.");
      setTimer(30); // Restart timer for resend code
      setCanResend(false);
    } catch (error) {
      setValidationMessage("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="form-box">
        <div className="form-header">
          <h2>{!isVerificationStage ? "Sign Up" : "Verify Your Email"}</h2>
          {!isVerificationStage && <p>Create your account</p>}
        </div>
        {!isVerificationStage ? (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-grid">
              <div className="input-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="input-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="input-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="input-field">
                <label>CNIC</label>
                <input
                  type="text"
                  name="CNIC"
                  value={formData.CNIC}
                  onChange={handleInputChange}
                  placeholder="13-digit CNIC"
                  required
                />
              </div>

              <div className="input-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  min="18"
                  max="100"
                  required
                />
              </div>
              <div className="input-field mb-2">
                <label className="block text-gray-700 text-sm mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

            </div>

            {validationMessage && (
              <p
                className={`validation-message ${validationMessage.includes("successfully") ? "success" : "error"}`}
              >
                {validationMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit}>
            <div className="verify-input">
              <label>Enter the 4-digit code sent to your email:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
            <div className="resend-link">
              {canResend ? (
                <button onClick={handleResendCode} className="resend-button">
                  Resend Code
                </button>
              ) : (
                `You can resend the code in ${timer} seconds`
              )}
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-image: url('/signin.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          animation: backgroundAnimation 8s infinite alternate;
        }

        @keyframes backgroundAnimation {
          0% {
            background: linear-gradient(135deg, #14b8a6, #0e9e8f);
          }
          100% {
            background: linear-gradient(135deg, #0e9e8f, #14b8a6);
          }
        }

        .form-box {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          border: 2px solid #e2e8f0;
          animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .form-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .form-header h2 {
          font-size: 26px;
          font-weight: bold;
          color: #2b3d47;
        }

        .form-header p {
          font-size: 14px;
          color: #6b7280;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-field label {
          font-size: 14px;
          color: #4a5568;
          margin-bottom: 6px;
        }

        .input-field input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #2b3d47;
          background-color: #f9fafb;
        }

        .input-field input:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 8px rgba(20, 184, 166, 0.7); /* Glowing effect on focus */
          animation: borderGlow 1.5s infinite alternate;
        }

        @keyframes borderGlow {
          0% {
            box-shadow: 0 0 5px rgba(20, 184, 166, 0.5);
          }
          100% {
            box-shadow: 0 0 12px rgba(20, 184, 166, 0.8);
          }
        }

        .validation-message {
          font-size: 14px;
          text-align: center;
          margin-bottom: 20px;
        }

        .validation-message.success {
          color: #14b8a6;
        }

        .validation-message.error {
          color: #e53e3e;
        }

        .submit-button {
          width: 160px;
          padding: 12px;
          background: linear-gradient(135deg, #14b8a6, #0e9e8f);
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          display: block;
          margin-left: auto;
          margin-right: auto;
          transition: all 0.3s ease;
        }

        .submit-button:disabled {
          background-color: #e2e8f0;
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #12a08d, #0c8c7c);
        }

        .resend-button {
          color: #0e9e8f;
          cursor: pointer;
          text-decoration: underline;
        }

        .resend-link {
          text-align: center;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
}
