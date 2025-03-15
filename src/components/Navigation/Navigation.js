import React from "react";
import { Button, Typography } from "@mui/material";
import "./Navigation.css";

const Navigation = ({ currentYear, handleYearChange }) => {
  return (
    <div className="navigation">
      <Button variant="contained" onClick={() => handleYearChange(currentYear - 1)}>Previous Year</Button>
      <Typography variant="h4">Full Year Calendar - {currentYear}</Typography>
      <Button variant="contained" onClick={() => handleYearChange(currentYear + 1)}>Next Year</Button>
    </div>
  );
};

export default Navigation;