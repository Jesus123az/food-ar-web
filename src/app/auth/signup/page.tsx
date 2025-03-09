'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phonenumber: "",
    email: "",
    // password: "",
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

    // Dummy data for the restaurant
    // const restaurantData = {
    //   name: "The Culinary Spot",
    //   phone_number: 1234567890,
    //   address: "123 Foodie Lane",
    //   rating: "4.5",
    //   reviews: "Excellent service and food.",
    //   email: formData.email,
    //   password: formData.password,
    // };
    const address = formData.address
    const email = formData.email
    const name = formData.name
    const phonenumber = formData.phonenumber

    try {

      // Send data to Google Sheet
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name,address,phonenumber,email }),
        });

        const responseText = await response.text(); // Wait for response text

        if (response.ok) {
            setMessage(`Email sent successfully!`);
        } else {
            setError(`Failed to send email.`);
        }
  
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex max-h-screen justify-center items-center dark:bg-boxdark rounded-lg pt-32">
        <div className="max-w-5xl w-full bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden flex">
          {/* Left Side with Image */}
          <div className="w-full md:w-1/2 bg-gray-200 dark:bg-darkgray flex justify-center items-center">
            <Image
              className="object-cover"
              src="/images/register/image.png"
              alt="Logo"
              width={500}
              height={200}
            />
          </div>

          {/* Right Side with Form */}
          <div className="w-full md:w-2/3 p-6 flex flex-col space-y-6">
            <div className="flex flex-row justify-center items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 pr-10">Already have an account? </span>
              <Link href="/auth/signin">
                <button className="w-full py-1 px-4 bg-[#FFC4A8] text-white font-medium rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600">
                  Log In
                </button>
              </Link>
            </div>

            <div>
              <h1 className="text-4xl mb-2 mt-6 font-extrabold text-center text-gray-800 dark:text-white">Get Started!</h1>
              <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Enter your details below</h2>

              <form onSubmit={handleSubmit} className="mx-6">
                {/* Name Input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#F74C17] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your Address"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#F74C17] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleInputChange}
                      placeholder="Enter your Phone Number"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#F74C17] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#F74C17] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Password Input
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#F74C17] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-[#F74C17] text-white font-medium rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
                {message && <div className="pt-6 text-green-500 mb-4">{message}</div>}
                {error && <div className="pt-6 text-red-500 mb-4">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
