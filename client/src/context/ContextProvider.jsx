import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <AppContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </AppContext.Provider>
  );
};
