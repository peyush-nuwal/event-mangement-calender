"use client";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Calender = ({ selectedDate, setSelectedDate }) => {
  // State to track the current month being viewed
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Header for the calendar that shows the current month and allows navigation
  const CalenderHeader = () => (
    <div className="h-[10%] flex justify-between items-center mb-4 pt-2">
      <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        Previous
      </Button>
      {/* Display the current month */}
      <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        Next
      </Button>
    </div>
  );

  // Render the week days (Mon, Tue, Wed, etc.)
  const renderWeek = () => {
    const weekDays = [];
    let startDate = startOfWeek(new Date()); // Get the start of the current week

    // Loop through the 7 days of the week and display the abbreviated weekday names
    for (let i = 0; i < 7; i++) {
      weekDays.push(
        <div key={i} className="text-start font-semibold">
          {format(addDays(startDate, i), "EEEE").substring(0, 3)}{" "}
          {/* Get first 3 letters of the day */}
        </div>
      );
    }

    return <div className="h-[5%] grid grid-cols-7 gap-1 px-3">{weekDays}</div>;
  };

  // Render the days of the month
  const renderDays = () => {
    const days = [];
    let startDate = startOfWeek(startOfMonth(currentMonth)); // Start from the first day of the month
    let endDate = endOfWeek(endOfMonth(currentMonth)); // End at the last day of the month

    // Loop through each day in the current month and generate the day buttons
    while (startDate <= endDate) {
      days.push(startDate);
      startDate = addDays(startDate, 1); // Move to the next day
    }

    return (
      <div className="h-[80%] grid grid-cols-7 gap-1">
        {/* For each day, create a button with the day number */}
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day)} // Set the selected date when clicked
            className={`flex flex-col justify-start items-start py-3 px-3 rounded 
  ${
    isSameDay(day, selectedDate) // If the day is the selected date, highlight it
      ? "bg-blue-500 text-white font-bold border-2 "
      : isSameDay(day, new Date()) // If the day is today, highlight it with a different color
      ? "bg-gray-200 text-black font-bold border-2 "
      : isSameMonth(day, currentMonth) // If the day is within the current month, show it normally
      ? "text-black hover:bg-gray-200"
      : "text-gray-400" // If it's outside the current month, make it gray
  }`}
          >
            {format(day, "d")} {/* Display the day number */}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[75%] h-screen px-5 py-2">
      {/* Render the calendar header */}
      {CalenderHeader()}
      {/* Render the days of the week (Mon, Tue, Wed, ...) */}
      {renderWeek()}
      {/* Render the days of the month */}
      {renderDays()}
    </div>
  );
};

export default Calender;
