import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import "./MonthCalendar.css";

const localizer = momentLocalizer(moment);

const MonthCalendar = ({ month, events, currentYear }) => {
  const startOfMonth = moment().year(currentYear).month(month).startOf("month");
  const endOfMonth = moment().year(currentYear).month(month).endOf("month");

  const monthEvents = events.filter((event) =>
    moment(event.start).isBetween(startOfMonth, endOfMonth, null, "[]")
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="month-calendar"
    >
      <h3>{startOfMonth.format("MMMM YYYY")}</h3>
      <Calendar
        localizer={localizer}
        events={monthEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        onSelectEvent={(event) =>
          alert(`Event: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`)
        }
        style={{ height: "300px" }}
      />
    </motion.div>
  );
};

export default MonthCalendar;