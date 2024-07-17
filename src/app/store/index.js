import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isOverlayVisible: false,
  user: null,
  studentClass: '',
  routineCount: 0
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user) => setGlobalState('user', user);
const setStudentClass = (studentClass) => setGlobalState('studentClass', studentClass);
const setRoutineCount = (routineCount) => setGlobalState('routineCount', routineCount);
const setIsOverlayVisible = (isOverlayVisible) => setGlobalState('isOverlayVisible', isOverlayVisible);

export { useGlobalState, 
        getGlobalState, 
        setUser,
        setStudentClass,
        setRoutineCount,
        setIsOverlayVisible };
