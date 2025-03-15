import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarGrid from "./components/CalendarGrid/CalendarGrid";
import Navigation from "./components/Navigation/Navigation";
import { Fade } from "@mui/material";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/.netlify/functions/calendar?year=${currentYear}`);
        const formattedEvents = response.data
          .filter((event) => event.summary)
          .map((event) => ({
            title: event.summary || "No Title",
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: !event.start.dateTime,
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
  }, [currentYear]);

  const handleYearChange = (newYear) => {
    setCurrentYear(newYear);
  };

  if (loading) {
    return <div className="loading">Loading calendar events...</div>;
  }

  if (error) {
    return <div className="error">Error fetching calendar events: {error.message}</div>;
  }

  return (
    <Fade in={true} timeout={1000}>
      <div className="app">
        <Navigation currentYear={currentYear} handleYearChange={handleYearChange} />
        <CalendarGrid events={events} currentYear={currentYear} />
      </div>
    </Fade>
  );
}

export default App;