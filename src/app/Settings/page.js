'use client';

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBell, faPaintBrush, faSave } from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("John Doe");

  const handleSaveSettings = () => {
    // Add your logic for saving settings
    alert("Settings saved!");
  };

  return (
    <div className="settings-container flex flex-col space-y-8">
      {/* Header */}
      <div className="settings-header flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold">Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="save-button bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-md flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} />
          Save
        </button>
      </div>

      {/* Account Settings */}
      <div className="account-settings bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="notification-settings bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Notification Settings</h3>
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium" htmlFor="emailNotifications">
            Email Notifications
          </label>
          <input
            type="checkbox"
            id="emailNotifications"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="toggle-checkbox"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="theme-settings bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Theme Settings</h3>
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium" htmlFor="darkMode">
            Dark Mode
          </label>
          <input
            type="checkbox"
            id="darkMode"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="toggle-checkbox"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="divider my-6"></div>

      {/* Footer */}
      <div className="footer flex items-center justify-center">
        <button
          onClick={() => alert("You have logged out!")}
          className="logout-button text-red-500 hover:text-red-600 font-semibold"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
