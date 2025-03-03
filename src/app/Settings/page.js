"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Settings() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profilePicture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            age: data.age || "",
            gender: data.gender || "",
            profilePicture: data.profilePicture || null,
          });
        }
      };

      fetchUser();
    }
  }, [status]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Settings updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while updating settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You need to sign in to view this page.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Settings</h2>

        {/* Profile Picture */}
        <div className="mb-6 flex flex-col items-center">
          {formData.profilePicture ? (
            <img
              src={formData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <label
            htmlFor="profilePictureUpload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
          >
            Upload
          </label>
          <input
            type="file"
            id="profilePictureUpload"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureUpload}
          />
        </div>

        {/* User Information */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-gray-400" : "bg-green-500"
            } text-white px-6 py-2 rounded-md hover:bg-green-600`}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
