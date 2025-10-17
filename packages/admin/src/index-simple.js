import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <div style={{padding: '40px', fontSize: '20px'}}>
    <h1>Admin App Test</h1>
    <p>If you see this, React is working!</p>
    <p>Port: 3002</p>
    <a href="/login">Go to login</a>
  </div>
);
