import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

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
        const formattedEvents = response.data.map((event) => ({
          title: event.summary,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: !event.start.dateTime, // Check if it's an all-day event
        }));
        setEvents(formattedEvents);
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

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <h1>My Calendar Events</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => alert(`Event: ${event.title}`)}
        style={{ height: "80vh" }}
      />
    </div>
  );
}

export default App;