import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";

const GameList = lazy(() => import("./pages/GameList"));
const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/games" element={<GameList />} />
          </Route>
          <Route path="/" element={<Navigate to="/games" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
