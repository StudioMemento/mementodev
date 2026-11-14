import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/v18-base.css";
import "./styles/v18-app.css";
import "./styles/v18-polish.css";
import "./styles/v18-refine.css";
import "./styles/polish.css";
import "./styles/v20.css";
const root = document.getElementById("root")!;
if (root.children.length)
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>,
  );
else
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
