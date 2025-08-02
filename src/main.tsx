// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TourFormProvider } from "@/context/TourFormContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TourFormProvider>
      <App />
    </TourFormProvider>
  </React.StrictMode>
);
