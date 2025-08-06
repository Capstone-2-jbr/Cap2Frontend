import React from "react";
import "./css/Genie.css";

const GenieSprite = () => {
  return (
    <div className="genie-container">
      <img
        src="/images/idle.gif"
        alt="Genie Idle"
        className="genie-sprite"
        draggable={false}
      />
    </div>
  );
};

export default GenieSprite;
