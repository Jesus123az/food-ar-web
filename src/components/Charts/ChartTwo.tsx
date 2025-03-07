"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#F24822", "#FDD7D3"], // Primary and secondary colors for bars
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: false,
    },
    background: "#EDF3F8",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "35%",
      borderRadius: 5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#EDF3F8",
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    categories: [], // Dynamically populated
    labels: {
      style: {
        colors: "#F24822",
        fontSize: "12px",
      },
    },
    axisBorder: {
      color: "#EDF3F8",
    },
    axisTicks: {
      color: "#EDF3F8",
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#F24822",
        fontSize: "12px",
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    markers: {
    radius: 99, // Circular markers
    },
    labels: {
      colors: "#F24822",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    theme: "light",
  },
};

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [noData, setNoData] = useState(false);
  const router = useRouter();

  // Updated fetchData to accept restaurantId as a string
  const fetchData = async (restaurantId: string) => {
    try {
      const response = await fetch(
        "https://tyrtpmeuzdeofymvegnm.supabase.co/functions/v1/get_orders_and_revenue_per_month",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurant_id_param: restaurantId }), // Use string directly
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      // Check if we have data
      if (!result.data || result.data.length === 0) {
        setNoData(true);
        return;
      }

      // Extract categories and revenue data
      const months = result.data.map((item: any) => item.month);
      const revenues = result.data.map((item: any) => item.total_revenue);

      setCategories(months);
      setSeries([{ name: "Revenue", data: revenues }]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNoData(true);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // If no userId is found, redirect to login page
      router.push("/auth/signin");
      return;
    }

    // Pass userId directly as a string, no Number conversion
    fetchData(userId);
  }, [router]);

  return (
    <div
      className="rounded-md p-5"
      style={{
        backgroundColor: "#EDF3F8",
        color: "#F24822",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Total Revenue Per Month</h2>
      </div>

      {noData ? (
        <div className="text-center text-sm text-gray-700">
          No Revenue
        </div>
      ) : (
        <div>
          <ReactApexChart
            options={{ ...options, xaxis: { ...options.xaxis, categories } }}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ChartTwo;