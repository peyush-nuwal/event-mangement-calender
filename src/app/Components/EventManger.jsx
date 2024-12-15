"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";

const EventManger = ({ selectedDate }) => {
  const dateKey = format(selectedDate, "yyyy-MM-dd"); // Format the selected date to be used as a key
  const [openAddBox, setOpenAddBox] = useState(false); // To toggle visibility of the add event form
  const [isEditing, setIsEditing] = useState(false); // To track if we are editing an event
  const [currentEditEventId, setCurrentEditEventId] = useState(null); // To store the id of the event being edited
  const [searchKeyword, setSearchKeyword] = useState(""); // To filter events by title or description
 const [events, setEvents] = useState({});

 useEffect(() => {
   const savedEvents = localStorage.getItem("events");
   if (savedEvents) {
     setEvents(JSON.parse(savedEvents));
   }
 }, []);

  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  // Handle form input changes to update the newEvent state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new event or update an existing one
  const addEvent = () => {
    // Validate that necessary fields are filled
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill in all the fields.");
      return;
    }

    const updatedEvents = { ...events };

    if (isEditing) {
      // Update the event if we are in edit mode
      updatedEvents[dateKey] = updatedEvents[dateKey].map((event) =>
        event.id === currentEditEventId ? { ...newEvent, id: event.id } : event
      );
    } else {
      // Add a new event to the date's event list
      updatedEvents[dateKey] = [
        ...(updatedEvents[dateKey] || []),
        { ...newEvent, id: Date.now() }, // Use timestamp as the unique event id
      ];
    }

    // Update events in localStorage and state
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Reset the form state
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    resetForm(); // Reset the form fields and close the add box
  };

  // Reset the form fields and states related to editing
  const resetForm = () => {
    setNewEvent({ title: "", startTime: "", endTime: "", description: "" });
    setIsEditing(false);
    setCurrentEditEventId(null);
    setOpenAddBox(false);
  };

  // Delete an event by its id
  const deleteEvent = (id) => {
    const updatedEvents = {
      ...events,
      [dateKey]: events[dateKey].filter((eve) => eve.id !== id), // Filter out the event to be deleted
    };
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents)); // Update the local storage
  };

  // Set the form for editing an event
  const editEvent = (eve) => {
    setNewEvent(eve); // Populate the form with the event data to edit
    setIsEditing(true);
    setCurrentEditEventId(eve.id); // Store the event id for reference
    setOpenAddBox(true); // Open the event form for editing
  };

  // Get filtered events based on the search keyword
  const getFilteredEvents = () => {
    if (!searchKeyword.trim()) {
      // If no search keyword, return events for the selected date
      return events[dateKey] || [];
    }

    const allEvents = Object.entries(events).flatMap(([date, dayEvents]) =>
      dayEvents.map((eve) => ({ ...eve, date }))
    );
    // Filter events by title or description containing the search keyword
    return allEvents.filter(
      (eve) =>
        eve.title.toLowerCase().includes(searchKeyword.toLocaleLowerCase()) ||
        eve.description
          .toLocaleLowerCase()
          .includes(searchKeyword.toLocaleLowerCase())
    );
  };

  const filterdEvents = getFilteredEvents();

  // Reset form whenever selectedDate changes
  useEffect(() => {
    resetForm();
  }, [selectedDate]);

  return (
    <div className="mt-5 w-[25%] h-screen flex flex-col p-3 overflow-y-auto">
      <h3 className="text-xl font-bold mb-2">
        Events for {format(selectedDate, "d/MMMM/yyyy")}{" "}
        {/* Display the selected date */}
      </h3>

      {/* Search bar to filter events */}
      <div className="flex items-center border rounded p-2 mb-5 ">
        <Input
          placeholder="Search events..."
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
          className="outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:outline-none active:ring-0 active:outline-none "
        />
      </div>

      {/* List of filtered events */}
      <ul className="space-y-2">
        {filterdEvents.length > 0 ? (
          filterdEvents.map((eve) => (
            <li key={eve.id} className="border p-2 rounded flex flex-col gap-2">
              <h6 className="w-full flex justify-between">
                <strong>{eve.title}</strong> ({eve.startTime} - {eve.endTime})
              </h6>
              <p>{eve.description}</p>
              {/* Edit and Delete buttons for each event */}
              <div className="flex gap-4 justify-end w-full">
                <Button
                  onClick={() => editEvent(eve)}
                  className="w-fit bg-blue-500 hover:bg-blue-600"
                >
                  <CiEdit /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteEvent(eve.id)}
                  className="w-fit"
                >
                  <BsTrash /> Delete
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 italic">No events for this date.</p>
        )}
      </ul>

      {/* Button to toggle event form (Add Event) */}
      {!openAddBox ? (
        <Button
          className="ml-auto w-fit my-2"
          onClick={() => setOpenAddBox(true)}
        >
          Add Event
        </Button>
      ) : (
        <>
          {/* Form for adding/editing an event */}
          <Input
            name="title"
            placeholder="Enter Title"
            onChange={handleInputChange}
            className="mb-2 mt-4"
            value={newEvent.title}
          />
          <Input
            name="startTime"
            placeholder="Start Time"
            onChange={handleInputChange}
            className="mb-2"
            value={newEvent.startTime}
          />
          <Input
            name="endTime"
            placeholder="End Time"
            onChange={handleInputChange}
            className="mb-2"
            value={newEvent.endTime}
          />
          <Textarea
            name="description"
            placeholder="Description (optional)"
            value={newEvent.description}
            onChange={handleInputChange}
            className="mb-2"
          />
          <Button
            onClick={addEvent}
            className="bg-blue-500 text-white hover:bg-blue-600 mt-2"
          >
            {isEditing ? "Save" : "Add Event"}{" "}
            {/* Button text depends on edit mode */}
          </Button>
        </>
      )}
    </div>
  );
};

export default EventManger;
