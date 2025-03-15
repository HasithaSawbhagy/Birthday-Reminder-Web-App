import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Fade } from "@mui/material";
import "./CalendarGrid.css";

const CalendarGrid = ({ events, currentYear }) => {
  return (
    <Fade in={true} timeout={1000}>
      <div className="calendar-grid">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="month-calendar">
              <h3>{new Date(currentYear, i).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
              <DateCalendar
                value={new Date(currentYear, i)}
                onChange={() => {}}
                readOnly
              />
            </div>
          ))}
        </LocalizationProvider>
      </div>
    </Fade>
  );
};

export default CalendarGrid;