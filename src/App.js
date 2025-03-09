import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { format, startOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const YearSelector = styled.div`
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  max-width: 200px;
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MonthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MonthHeader = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
`;

const Day = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 8px;
  background: ${({ isCurrentMonth }) => (isCurrentMonth ? "#f0f0f0" : "#e0e0e0")};
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? "#333" : "#888")};
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 14px;
  position: relative;

  &:hover {
    background: #007bff;
    color: white;
  }

  &.selected {
    background: #007bff;
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 3px;
  }
`;

const EventBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #ff4757;
  border-radius: 50%;
`;

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const startDate = startOfYear(new Date(selectedYear, 0, 1));
  const months = eachMonthOfInterval({ start: startDate, end: new Date(selectedYear, 11, 31) });

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i);

  if (loading) {
    return <div>Loading calendar events...</div>;
  }

  if (error) {
    return <div>Error fetching calendar events: {error.message}</div>;
  }

  return (
    <div>
      <h1>My Calendar Events</h1>

      <CalendarContainer>
        <YearSelector>
          <Select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </YearSelector>
        <MonthsGrid>
          {months.map((month, i) => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart);
            const endDate = endOfWeek(monthEnd);
            const days = eachDayOfInterval({ start: startDate, end: endDate });

            return (
              <MonthContainer key={i}>
                <MonthHeader>{format(month, "MMMM")}</MonthHeader>
                <DaysGrid>
                  {days.map((day, j) => {
                    const hasEvent = events.some((event) =>
                      isSameDay(new Date(event.start.date || event.start.dateTime), day)
                    );
                    return (
                      <Day
                        key={j}
                        isCurrentMonth={isSameMonth(day, monthStart)}
                        className={isSameDay(day, selectedDate) ? "selected" : ""}
                        onClick={() => onDateClick(day)}
                      >
                        {format(day, "d")}
                        {hasEvent && <EventBadge />}
                      </Day>
                    );
                  })}
                </DaysGrid>
              </MonthContainer>
            );
          })}
        </MonthsGrid>
      </CalendarContainer>

      {/* **Display Birthday Events** */}
      {events.filter((event) => event.summary.toLowerCase().includes("birthday")).length > 0 && (
        <div>
          <h2>Birthdays</h2>
          <ul>
            {events
              .filter((event) => event.summary.toLowerCase().includes("birthday"))
              .map((event, index) => (
                <li key={`birthday-${index}`}>
                  <strong>{event.summary}</strong>
                  <br />
                  Date:{" "}
                  {event.start && event.start.date
                    ? new Date(event.start.date).toLocaleDateString()
                    : "N/A"}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* **Display Other Calendar Events** */}
      {events.filter((event) => !event.summary.toLowerCase().includes("birthday")).length > 0 && (
        <div>
          <h2>Other Events</h2>
          <ul>
            {events
              .filter((event) => !event.summary.toLowerCase().includes("birthday"))
              .map((event, index) => (
                <li key={`event-${index}`}>
                  <strong>{event.summary}</strong>
                  <br />
                  Start:{" "}
                  {event.start ? new Date(event.start.date || event.start.dateTime).toLocaleString() : "N/A"}
                  <br />
                  End:{" "}
                  {event.end ? new Date(event.end.date || event.end.dateTime).toLocaleString() : "N/A"}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* **Message if no events are found** */}
      {events.length === 0 && !loading && !error && <p>No upcoming events found.</p>}
    </div>
  );
}

export default App;