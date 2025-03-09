import React from "react";
import "./Navigation.css";

const Navigation = ({ currentYear, handleYearChange }) => {
  return (
    <div className="navigation">
      <button onClick={() => handleYearChange(currentYear - 1)}>Previous Year</button>
      <h1>Full Year Calendar - {currentYear}</h1>
      <button onClick={() => handleYearChange(currentYear + 1)}>Next Year</button>
    </div>
  );
};

export default Navigation;