"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}

const ChartOne: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    series: [{ name: "Total Orders", data: [] }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const router = useRouter();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#F24822"],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      background: "#EDF3F8",
    },
    stroke: {
      curve: "smooth",
      width: 2,
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
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      colors: ["#FFFFFF"],
      strokeColors: "#F24822",
      strokeWidth: 3,
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
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
    tooltip: {
      theme: "light",
    },
  };

  // Updated fetchData to accept restaurantId as a string
  const fetchData = async (restaurantId: string) => {
    console.log("Fetching data for Restaurant ID:", restaurantId); // confirmation
    setLoading(true);
    setError(null);
    setNoData(false);

    const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_API_KEY}get_orders_and_revenue_per_month`;
    try {
      const response = await fetch(
        apiUrl,
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
      const { data } = result;

      if (!data || data.length === 0) {
        setNoData(true);
        return;
      }

      const categories = data.map((item: any) => item.month);
      const seriesData = data.map((item: any) => item.order_count);

      setChartData({
        categories,
        series: [{ name: "Total Orders", data: seriesData }],
      });
    } catch (err) {
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/auth/signin");
      return;
    }

    // Pass userId directly as a string, no Number conversion
    fetchData(userId);
  }, [router]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
        <h2 className="text-lg font-semibold">Total Orders</h2>
      </div>

      {noData ? (
        <div className="text-center text-sm text-gray-700">
          No Order Found!
        </div>
      ) : (
        <div>
          <ReactApexChart
            options={options}
            series={chartData.series}
            type="area"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ChartOne;