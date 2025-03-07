'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API request for user login
    try {
      const response = await fetch("YOUR_LOGIN_API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user id and other necessary data in localStorage (or cookies)
        localStorage.setItem("userId", data.profile.id); // Store the user ID
        localStorage.setItem("userEmail", data.profile.email); // Store the user email
        localStorage.setItem("userFullName", data.profile.full_name); // Store the user full name
        localStorage.setItem("userRating", data.profile.rating); // Store rating

        // Redirect to the desired page after successful login
        router.push("/orders");
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      {error && <div>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignIn;
