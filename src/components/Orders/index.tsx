"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Item {
  id: number;
  price: number;
  quantity: number;
  restaurant_items: {
    id: number;
    name: string;
    price: number;
    description: string;
  };
}

interface Order {
  id: number;
  created_at: string;
  total_price: number;
  status: number;
  users: {
    id: number;
    email: string;
    full_name: string;
  };
  restaurant: {
    id: string;
    name: string;
    address: string;
    phone_number: number;
  };
  order_items: Item[];
}

const Orders = () => {
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed" | "Cancelled">("All");
  const [showPopup, setShowPopup] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<"Cancel" | "Complete">("Cancel");
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async (restaurantId: string) => {
    setLoading(true);
    console.log("Restaurant ID:", restaurantId);
    try {
      const response = await fetch(
        "https://tyrtpmeuzdeofymvegnm.supabase.co/functions/v1/orders_restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurant_id: restaurantId }),
          cache: "no-store",
        }
      );
      console.log("API Response:", response);
      const data = await response.json();
      console.log("Parsed Data:", data);

      if (data.orders && data.orders.length > 0) {
        const order = data.orders[0];
        localStorage.setItem("restaurantName", order.restaurant.name);
        localStorage.setItem("restaurantLocation", order.restaurant.address);
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = (filter: "All" | "Pending" | "Completed" | "Cancelled") => {
    if (!Array.isArray(orders)) {
      return [];
    }
    if (filter === "All") {
      return orders;
    }
    const statusMap: { [key: string]: number } = {
      Pending: 0,
      Cancelled: 1,
      Completed: 2,
    };
    return orders.filter((order) => order.status === statusMap[filter]) || [];
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-gray-500"; // Pending
      case 1:
        return "bg-red-500"; // Cancelled
      case 2:
        return "bg-green-500"; // Completed
      default:
        return "bg-gray-500";
    }
  };

  const handleShowPopup = (order: Order) => {
    setCurrentOrder(order);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentOrder(null);
  };

  const handleOrderAction = (order: Order, action: "Cancel" | "Complete") => {
    setCurrentOrder(order);
    setConfirmationType(action);
    setShowConfirmation(true);
    setShowPopup(false); // Close the order details popup
  };

  const confirmAction = async () => {
    if (currentOrder) {
      const newStatus = confirmationType === "Cancel" ? 1 : 2;
      try {
        const response = await fetch(
          "https://tyrtpmeuzdeofymvegnm.supabase.co/functions/v1/update_order_status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id: currentOrder.id, status: newStatus }),
          }
        );
        if (response.ok) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === currentOrder.id ? { ...order, status: newStatus } : order
            )
          );
        } else {
          alert("Failed to update the order status.");
        }
      } catch (error) {
        console.error("Error updating the order status:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setShowConfirmation(false);
        setShowPopup(false); // Already closed, but ensures consistency
      }
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/auth/signin");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/auth/signin");
      return;
    }
    fetchOrders(userId);
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Filter Section */}
        <div className="flex items-center justify-between p-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("All")}
              className={`filter-btn ${
                filter === "All" ? "bg-[#F74C17] text-white" : "border-black text-black"
              } px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`filter-btn ${
                filter === "Pending" ? "bg-[#F74C17] text-white" : "border-black text-black"
              } px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("Completed")}
              className={`filter-btn ${
                filter === "Completed" ? "bg-[#F74C17] text-white" : "border-black text-black"
              } px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("Cancelled")}
              className={`filter-btn ${
                filter === "Cancelled" ? "bg-[#F74C17] text-white" : "border-black text-black"
              } px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300`}
            >
              Cancelled
            </button>
          </div>
          <p className="text-lg font-semibold text-black">
            {new Date().toLocaleString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        {/* Order Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {filteredOrders(filter)?.length > 0 ? (
            filteredOrders(filter).map((order) => (
              <div
                key={order.id}
                className="transition-transform transform hover:scale-105 bg-[#EDF3F8] p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-black font-extrabold">
                    {order.users?.full_name || "Unknown User"}
                  </h3>
                  <span
                    className={`px-6 py-1 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 ${
                      getStatusColor(order.status) || "bg-gray-500"
                    } text-white`}
                  >
                    {order.status === 0
                      ? "Pending"
                      : order.status === 1
                      ? "Cancelled"
                      : "Completed"}
                  </span>
                </div>
                <div className="my-4 h-px bg-black"></div>
                <div className="item flex justify-between">
                  <p className="text-sm text-black">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown Date"}
                  </p>
                  <p className="text-sm text-black">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "Unknown Time"}
                  </p>
                </div>

                {/* Items Details (First 2 Items) */}
                <div className="items-list mt-4">
                  <div className="item flex justify-between font-bold">
                    <span className="text-md text-black">Item</span>
                    <span className="text-md text-black">Qty</span>
                    <span className="text-md text-black">Price</span>
                  </div>
                  {order.order_items.slice(0, 2).map((item, index) => (
                    <div key={index} className="item flex justify-between mt-2">
                      <span className="text-sm text-black">{item.restaurant_items.name}</span>
                      <span className="text-sm text-black">{item.quantity}</span>
                      <span className="text-sm text-black">${item.price}</span>
                    </div>
                  ))}
                  {order.order_items.length > 2 && (
                    <button
                      onClick={() => handleShowPopup(order)}
                      className="text-sm text-[#F74C17] hover:text-black mt-2"
                    >
                      Show more items
                    </button>
                  )}
                </div>

                <div className="my-4 h-px bg-black"></div>

                <div className="total flex justify-between items-center mt-4">
                  <p className="font-bold text-black">Total</p>
                  <p className="text-lg font-bold text-black">${order.total_price}</p>
                </div>

                <div className="actions mt-4 flex justify-between">
                  <button
                    onClick={() => handleOrderAction(order, "Cancel")}
                    className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-red-500 text-white hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleOrderAction(order, "Complete")}
                    className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-green-500 text-white hover:bg-green-600"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>

      {/* Order Details Popup */}
      {showPopup && currentOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#EDF3F8] p-2 rounded-lg w-1/2">
            <div className="flex items-center justify-end actions">
              <button
                onClick={handleClosePopup}
                className="px-2 py-1 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-gray-500 text-white hover:bg-gray-600"
              >
                X
              </button>
            </div>

            <div className="px-12 py-6">
              <div className="item flex justify-between font-bold">
                <span className="text-2xl text-black font-extrabold">
                  {currentOrder.users.full_name}
                </span>
                <span
                  className={`px-6 py-1 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 ${getStatusColor(
                    currentOrder.status
                  )} text-white`}
                >
                  {currentOrder.status === 0
                    ? "Pending"
                    : currentOrder.status === 1
                    ? "Cancelled"
                    : "Completed"}
                </span>
              </div>
              <div className="item flex justify-between mt-2">
                <span className="text-md text-black font-extrabold">
                  {new Date(currentOrder.created_at).toLocaleString()}
                </span>
              </div>

              <div className="my-4 h-px bg-black"></div>

              <div className="items-list mt-4">
                <div className="item flex justify-between font-bold">
                  <span className="text-md text-black">Item</span>
                  <span className="text-md text-black">Qty</span>
                  <span className="text-md text-black">Price</span>
                </div>
                {currentOrder.order_items.map((item, index) => (
                  <div key={index}>
                    <div className="item flex justify-between mt-2">
                      <span className="text-sm text-black">{item.restaurant_items.name}</span>
                      <span className="text-sm text-black">{item.quantity}</span>
                      <span className="text-sm text-black">${item.price}</span>
                    </div>
                    <span className="text-sm text-black">
                      {item.restaurant_items.description}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-4 h-px bg-black"></div>

              <div className="total flex justify-between items-center mt-4">
                <p className="font-bold text-black">Total</p>
                <p className="text-lg font-bold text-black">${currentOrder.total_price}</p>
              </div>

              <div className="mt-4 flex justify-between items-end">
                <button
                  onClick={() => handleOrderAction(currentOrder, "Cancel")}
                  className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOrderAction(currentOrder, "Complete")}
                  className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-green-500 text-white hover:bg-green-600"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold text-black">
              Are you sure you want to{" "}
              {confirmationType === "Cancel" ? "cancel" : "mark as completed"} this order?
            </h3>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmAction}
                className="px-6 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300 bg-[#F74C17] text-white hover:bg-[#AFCAE1] mr-2"
              >
                Yes, {confirmationType}
              </button>
              <button
                onClick={cancelConfirmation}
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

export default Orders;