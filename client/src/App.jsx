import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={"/"} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
