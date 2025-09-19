"use client";
import { useState } from "react";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  // Hardcoded credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {!loggedIn ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const username = form.username.value;
                const password = form.password.value;
                const success = handleLogin(username, password);
                if (!success) {
                  alert("Invalid credentials. Please try again.");
                }
              }}
              className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
            >
              <h2 className="text-2xl font-semibold text-gray-700 text-center">
                Admin Login
              </h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <>
            <Sidebar />
            <main className="flex-1 bg-gray-100 min-h-screen p-6">{children}</main>
          </>
        )}
      </body>
    </html>
  );
}
