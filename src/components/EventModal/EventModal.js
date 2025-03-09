import React from "react";
import { motion } from "framer-motion";
import "./EventModal.css";

const EventModal = ({ event, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="event-modal"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="event-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{event.title}</h2>
        <p><strong>Start:</strong> {new Date(event.start).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(event.end).toLocaleString()}</p>
        <button onClick={onClose}>Close</button>
      </motion.div>
    </motion.div>
  );
};

export default EventModal;