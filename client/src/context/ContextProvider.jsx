import { useState } from "react";
import { AppContext } from "./ContextProvider";

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(
    JSON.parse(localStorage.getItem("sidebar")) === "true",
  );

  return (
    <AppContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </AppContext.Provider>
  );
};
