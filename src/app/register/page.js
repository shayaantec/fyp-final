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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "CNIC") {
      setFormData((prev) => ({ ...prev, CNIC: formatCNIC(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to format CNIC with dashes
  const formatCNIC = (cnic) => {
    const clean = cnic.replace(/\D+/g, ""); // Remove non-numeric characters
    return clean.replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3").substring(0, 15); // Add dashes
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setValidationMessage("");
    setIsSubmitting(true);

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
        setTimer(60); // Reset timer for resend code
        setCanResend(false);
      }
    } catch (error) {
      setValidationMessage("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (response.ok) window.location.href = result.redirectUrl;
    } catch (error) {
      setValidationMessage("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {isVerificationStage ? "Verify Your Email" : "Register"}
        </h2>
        {!isVerificationStage ? (
          <form onSubmit={handleRegisterSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* CNIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                <input
                  type="text"
                  name="CNIC"
                  value={formData.CNIC}
                  onChange={handleInputChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>

            {validationMessage && (
              <p
                className={`text-center mt-4 ${
                  validationMessage.includes("successfully") ? "text-green-500" : "text-red-500"
                }`}
              >
                {validationMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full py-2 text-white rounded-md ${
                isSubmitting ? "bg-gray-400" : "bg-green-500"
              } hover:bg-green-600 transition-all`}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter the 4-digit code sent to your email:
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {validationMessage && (
              <p
                className={`text-center mb-4 ${
                  validationMessage.includes("successfully") ? "text-green-500" : "text-red-500"
                }`}
              >
                {validationMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 text-white rounded-md ${
                isSubmitting ? "bg-gray-400" : "bg-green-500"
              } hover:bg-green-600 transition-all`}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>

            <div className="text-sm text-gray-600 mt-4 text-center">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-blue-500 hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                `You can resend the code in ${timer} seconds`
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
