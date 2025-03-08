import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/.netlify/functions/calendar");
        setEvents(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  if (loading) {
    return <div>Loading calendar events...</div>;
  }

  if (error) {
    return <div>Error fetching calendar events: {error.message}</div>;
  }

  // **Function to check if an event is a birthday (basic example)**
  const isBirthdayEvent = (event) => {
    if (!event.summary) return false; // No summary, not likely a birthday (adjust as needed)
    return event.summary.toLowerCase().includes("birthday"); // Check if summary contains "birthday"
    // You can add more sophisticated checks here, like checking for all-day events
    // if birthdays in your calendar are consistently marked as all-day.
    // Example of all-day check (if you want to add it):
    // return event.start && event.start.date && event.summary.toLowerCase().includes("birthday");
  };

  // **Separate birthday events and other events**
  const birthdayEvents = events.filter(isBirthdayEvent);
  const otherEvents = events.filter((event) => !isBirthdayEvent(event));

  return (
    <div>
      <h1>My Calendar Events</h1>

      {/* **Display Birthday Events** */}
      {birthdayEvents.length > 0 && (
        <div>
          <h2>Birthdays</h2>
          <ul>
            {birthdayEvents.map((event, index) => (
              <li key={`birthday-${index}`}>
                <strong>{event.summary}</strong>
                <br />
                Date:{" "}
                {event.start && event.start.date
                  ? new Date(event.start.date).toLocaleDateString() // Display only date for birthdays
                  : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* **Display Other Calendar Events** */}
      {otherEvents.length > 0 && (
        <div>
          <h2>Other Events</h2>
          <ul>
            {otherEvents.map((event, index) => (
              <li key={`event-${index}`}>
                <strong>{event.summary}</strong>
                <br />
                Start:{" "}
                {event.start ? new Date(event.start).toLocaleString() : "N/A"}
                <br />
                End: {event.end ? new Date(event.end).toLocaleString() : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* **Message if no events are found** */}
      {events.length === 0 && !loading && !error && (
        <p>No upcoming events found.</p>
      )}
    </div>
  );
}

export default App;