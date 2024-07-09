import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isOverlayVisible: false,
  user: null,
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user) => setGlobalState('user', user);
const setIsOverlayVisible = (isOverlayVisible) => setGlobalState('isOverlayVisible', isOverlayVisible);

export { useGlobalState, 
        getGlobalState, 
        setUser,
        setIsOverlayVisible };
