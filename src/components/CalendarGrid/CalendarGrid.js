import React from "react";
import MonthCalendar from "../MonthCalendar/MonthCalendar";
import "./CalendarGrid.css";

const CalendarGrid = ({ events, currentYear }) => {
  return (
    <div className="calendar-grid">
      {Array.from({ length: 12 }, (_, i) => (
        <MonthCalendar key={i} month={i} events={events} currentYear={currentYear} />
      ))}
    </div>
  );
};

export default CalendarGrid;