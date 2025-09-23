import React, { useState, useEffect } from "react";
import "./App.css"; // Make sure you have styling in App.css

function Welcome() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US");
  const formattedTime = currentTime.toLocaleTimeString("en-US");

  return (
    <div className="container">
      <h1>
        Welcome to <span className="highlight">CHARUSAT!!!!</span>
      </h1>
      <h2>
        It is <span className="highlight">{formattedDate}</span>
      </h2>
      <h2>
        It is <span className="highlight">{formattedTime}</span>
      </h2>
    </div>
  );
}

export default Welcome;
