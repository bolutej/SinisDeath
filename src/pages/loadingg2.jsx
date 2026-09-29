// import React from "react";
import "../App.css";
import sinisdeath from '../assets/sinisdeath_logo_dark.svg'

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-ring"></div>

        <img
          src={sinisdeath}
          alt="Loading..."
          className="loading-logo"
        />
      </div>

      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;