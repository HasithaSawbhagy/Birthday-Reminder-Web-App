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
  const [currentYear, setCurrentYear] = useState(moment().year()); // Track the current year

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/.netlify/functions/calendar?year=${currentYear}`);
        const formattedEvents = response.data
          .filter((event) => event.summary) // Filter out events without a summary
          .map((event) => ({
            title: event.summary || "No Title", // Fallback for missing titles
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
  }, [currentYear]); // Refetch events when the year changes

  const handleYearChange = (newYear) => {
    setCurrentYear(newYear);
  };

  const renderMonthCalendar = (month) => {
    const startOfMonth = moment().year(currentYear).month(month).startOf("month");
    const endOfMonth = moment().year(currentYear).month(month).endOf("month");

    const monthEvents = events.filter((event) =>
      moment(event.start).isBetween(startOfMonth, endOfMonth, null, "[]")
    );

    return (
      <div key={month} style={{ marginBottom: "20px" }}>
        <h3>{startOfMonth.format("MMMM YYYY")}</h3>
        <Calendar
          localizer={localizer}
          events={monthEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          onSelectEvent={(event) => alert(`Event: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`)}
          style={{ height: "300px" }}
        />
      </div>
    );
  };

  if (loading) {
    return <div>Loading calendar events...</div>;
  }

  if (error) {
    return <div>Error fetching calendar events: {error.message}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Full Year Calendar - {currentYear}</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => handleYearChange(currentYear - 1)}>Previous Year</button>
        <button onClick={() => handleYearChange(currentYear + 1)} style={{ marginLeft: "10px" }}>
          Next Year
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {Array.from({ length: 12 }, (_, i) => renderMonthCalendar(i))}
      </div>
    </div>
  );
}

export default App;