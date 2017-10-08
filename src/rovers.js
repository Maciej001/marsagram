import React from "react";
import Rover from './Rover'

const Rovers = ({ rovers, activeRover, onClick }) => (
  <div className="rovers">
    {rovers.map(rover => (
      <Rover
        key={rover}
        name={rover}
        active={rover === activeRover}
        onClick={onClick}
      />
    ))}
  </div>
);

export default Rovers;
