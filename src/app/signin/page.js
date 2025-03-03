"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message

    try {
      const result = await signIn("credentials", {
        redirect: false, // Disable automatic redirection
        email,
        password,
      });

      if (result.error) {
        setError(result.error); // Display error returned by next-auth
      } else {
        // Fetch the user's session to get their role
        const session = await fetch("/api/auth/session").then((res) => res.json());

        if (session?.user?.role === "student") {
          router.push("/StudentDashboard");
        } else if (session?.user?.role === "teacher") {
          router.push("/TeacherDashboard");
        } else {
          setError("Invalid role. Please contact support.");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600 relative overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/signin.png"
          alt="Background Illustration"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-50"
        />
      </div>

      {/* Sign-In Form */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-2xl p-8 animate-slide-in">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="LEETCONNECT Logo"
            width={200}
            height={60}
            className="animate-bounce"
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Log in to access your account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-right text-sm mt-2">
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </p>
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-medium text-lg rounded-md hover:bg-green-600 transition-all"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
};

export default LoginPage;
