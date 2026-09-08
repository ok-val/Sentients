import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router";
import JayMort from "./JayMort/JayMort.jsx";
import Chabot from "./Chabot/Chabot.jsx";
import SAM from "./SAM/SAM.jsx";
import Schon from "./SchonGPT/Schon.jsx";
import TestApp from "./TestApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chabot" element={<Chabot />} />
        <Route path="/jaymort" element={<JayMort />} />
        <Route path="/sam" element={<SAM />} />
        <Route path="/schon" element={<Schon />} />
      </Routes>
    </HashRouter>
    {/* <TestApp /> */}
  </StrictMode>,
);
