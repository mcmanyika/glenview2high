'use client'
import { useState } from 'react';

export const useNavigation = (initialComponent = null) => {
  const [currentComponent, setCurrentComponent] = useState(initialComponent);

  const navigateTo = (component) => {
    setCurrentComponent(component);
  };

  return { currentComponent, navigateTo };
}; 