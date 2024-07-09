import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const toggleMenu = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  return (
    <MenuContext.Provider value={{ isOverlayVisible, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
