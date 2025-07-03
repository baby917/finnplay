import { createRoot } from "react-dom/client";
import AppRoutes from "./routes";
import "./main.scss";

createRoot(document.getElementById("root")!).render(<AppRoutes />);
