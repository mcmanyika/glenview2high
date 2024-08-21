import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isOverlayVisible: false,
  user: null,
  schoolName: '',
  studentClass: '',
  teacherId: '',
  userType: '',
  studentId: '',
  routineCount: 0
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user) => setGlobalState('user', user);
const setSchoolName = (schoolName) => setGlobalState('schoolName', schoolName);
const setStudentClass = (studentClass) => setGlobalState('studentClass', studentClass);
const setStudentId = (studentId) => setGlobalState('studentId', studentId);
const setTeacherId = (teacherId) => setGlobalState('teacherId', teacherId);
const setUserType = (userType) => setGlobalState('userType', userType);
const setRoutineCount = (routineCount) => setGlobalState('routineCount', routineCount);
const setIsOverlayVisible = (isOverlayVisible) => setGlobalState('isOverlayVisible', isOverlayVisible);

export { useGlobalState, 
        getGlobalState, 
        setUser,
        setSchoolName,
        setStudentClass,
        setUserType,
        setStudentId,
        setTeacherId,
        setRoutineCount,
        setIsOverlayVisible };
