"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RestaurantData {
  fullName: string; // Changed to match SignIn's userFullName
  restaurantName: string; // Added for restaurant name
  location: string;
  email: string;
}

const Profile = () => {
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/auth/signin");
      return;
    }

    // Read data from localStorage
    const fullName = localStorage.getItem("userFullName") || "Unknown";
    const restaurantName = localStorage.getItem("restaurantName") || "Unknown";
    const location = localStorage.getItem("restaurantLocation") || "Unknown";
    const email = localStorage.getItem("userEmail") || "unknown@example.com";

    setRestaurantData({
      fullName,
      restaurantName,
      location,
      email,
    });
  }, [router]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("restaurantLocation");
    localStorage.removeItem("userEmail");
    router.push("/auth/signin");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!restaurantData) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header Section with Profile Title and Logout Button */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-4xl font-bold text-black">Profile</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-lg font-semibold rounded-md cursor-pointer transition-colors duration-300 bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-2xl font-semibold text-black">Restaurant Name:</span>
              <p className="text-xl text-gray-600 break-words mt-1">{restaurantData.restaurantName}</p>
            </div>
            <div>
              <span className="text-2xl font-semibold text-black">Location:</span>
              <p className="text-xl text-gray-600 break-words mt-1">{restaurantData.location}</p>
            </div>
            <div>
              <span className="text-2xl font-semibold text-black">Email:</span>
              <p className="text-xl text-gray-600 break-words mt-1">{restaurantData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold text-black">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmLogout}
                className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-[#F74C17] text-white hover:bg-[#AFCAE1] mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;