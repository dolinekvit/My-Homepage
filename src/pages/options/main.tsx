import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { Options } from "@/pages/options/Options";
import { AppProviders } from "@/providers/AppProviders";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <Options />
    </AppProviders>
  </StrictMode>,
);
