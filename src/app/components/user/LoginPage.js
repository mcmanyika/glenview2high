"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Set to false to handle errors properly
    });

    if (result.error) {
      setError(result.error); // Set the error state
    } else {
      // Redirect if the sign-in was successful
      window.location.href = "/"; // Redirect to the homepage
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br gap-1">
      <div className="shadow p-4 rounded-md flex flex-col gap-2">
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        <input
          type="email"
          placeholder="Email" // Improved placeholder for clarity
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Make it a required field
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password" // Improved placeholder for clarity
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Make it a required field
          className="p-2 border rounded"
        />
        <button onClick={onSubmit} className="bg-blue-500 text-white rounded py-2">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
