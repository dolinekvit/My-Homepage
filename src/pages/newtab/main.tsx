import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { NewTab } from "@/pages/newtab/NewTab";
import { AppProviders } from "@/providers/AppProviders";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <NewTab />
    </AppProviders>
  </StrictMode>,
);
