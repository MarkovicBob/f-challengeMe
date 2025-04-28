import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
    // if(user && user.admin){
    //     navigate('dashboard')
    // }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <GlobalContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useAuth = () => useContext(GlobalContext);
