import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import MyCalendar from "./pages/MyCalendar";
import Stats from "./pages/Stats";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="goals" element={<Goals/>} />
        <Route path="calendar" element={<MyCalendar />} />
        <Route path="stats" element={<Stats />} />
        <Route path="journal" element={<Journal />} />
        <Route path="settings" element={<Settings/>} />
      </Route>
    </Routes>
  );
};

export default App;
