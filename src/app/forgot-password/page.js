"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code, Step 3: New Password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async () => {
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }
    setError("");
    setMessage("Verification code verified successfully.");
    setStep(3); // Move to the next step
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          // Redirect to login page after success
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {step === 1 && (
          <>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleSendCode}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
            >
              Send Verification Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
            >
              Verify Code
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <label className="block text-sm font-medium mt-4 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleResetPassword}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
