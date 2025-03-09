"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

    const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_API_KEY}login_restaurant`;
    // Avoid logging the URL
    // console.log("Constructed url", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userId", data.profile.id);
        localStorage.setItem("userEmail", data.profile.email);
        localStorage.setItem("userFullName", data.profile.full_name);
        localStorage.setItem("userRating", data.profile.rating);
        console.log("Login successful", data);
        setLoading(false);
        setMessage("Account Created Successfully!");
        router.push("/orders");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      // Suppress the error from appearing in the console
      setLoading(false);
      setError("Account doesn't exist!");
    }
  };

  return (
    <div className="flex max-h-screen justify-center items-center dark:bg-boxdark overflow-hidden rounded-lg pt-32">
      <div className="max-w-5xl w-full bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden flex">
        <div className="w-full md:w-1/2 bg-gray-200 dark:bg-darkgray flex justify-center items-center">
          <Image className="object-cover" src="/images/register/image.png" alt="Logo" width={500} height={200} />
        </div>

        <div className="w-full md:w-2/3 p-6 flex flex-col space-y-6">
          <div className="flex flex-row justify-center items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300 pr-10">Don&apos;t have an account? </span>
            <Link href="/auth/signup">
              <button className="w-full py-1 px-4 bg-[#FFC4A8] text-white font-medium rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600">
                Sign Up
              </button>
            </Link>
          </div>

          <div>
            <h1 className="text-4xl mb-2 mt-6 font-extrabold text-center text-gray-800 dark:text-white">Welcome Back!</h1>
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Enter your details below</h2>

            <form onSubmit={handleSubmit} className="space-y-6 mx-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-boxdark dark:border-strokedark dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-boxdark dark:border-strokedark dark:text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? "Working ..." : "Sign In"}
                </button>
                {message && <div className="pt-6 text-green-500 mb-4">{message}</div>}
                {error && <div className="pt-6 text-red-500 mb-4">{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;