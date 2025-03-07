"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  return (
    <>
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-4xl font-bold text-black">Dashboard</h1>
        <p className="text-lg font-semibold text-black">
          {new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>

      <ChartOne />
      
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
      </div>
    </>
  );
};

export default ECommerce;
