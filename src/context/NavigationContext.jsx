import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'habits', 'todos', 'analytics'

    return (
        <NavigationContext.Provider value={{ activeView, setActiveView }}>
            {children}
        </NavigationContext.Provider>
    );
};
