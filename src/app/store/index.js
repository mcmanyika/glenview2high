
import { createGlobalState } from 'react-hooks-global-state';


const initialState = {

  user: null,
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user) => setGlobalState('user', user);

export { useGlobalState, 
        getGlobalState, 
        setUser };
