'use client';
import { useState } from "react"; // Import React's useState hook for managing state
import Calender from "./Components/Calender"; // Import the Calender component
import EventManger from './Components/EventManger'; // Import the EventManger component

export default function Home() {
  // State to track the selected date in the calendar
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    // Main container with a flex layout and divider between two components
    <main className="flex divide-x-2 divide-solid divide-stone-200">
      {/* Pass selectedDate as a prop to EventManger to manage events for the selected date */}
      <EventManger selectedDate={selectedDate} />

      {/* Pass selectedDate and setSelectedDate as props to Calender for calendar display and interaction */}
      <Calender selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </main>
  );
}
