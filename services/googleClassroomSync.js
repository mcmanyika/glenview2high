// services/googleClassroomSync.js
import { database } from '../utils/firebaseConfig';
import { ref, set } from 'firebase/database';

export const syncAssignmentToFirebase = async (assignment, courseId) => {
  try {
    const assignmentRef = ref(database, `googleClassroom/assignments/${courseId}/${assignment.id}`);
    await set(assignmentRef, {
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      creationTime: assignment.creationTime,
      maxPoints: assignment.maxPoints,
      workType: assignment.workType,
      state: assignment.state
    });
    return true;
  } catch (error) {
    console.error('Error syncing assignment:', error);
    return false;
  }
};

export const syncCourseToFirebase = async (course) => {
  try {
    const courseRef = ref(database, `googleClassroom/courses/${course.id}`);
    await set(courseRef, {
      name: course.name,
      section: course.section,
      description: course.description,
      room: course.room,
      ownerId: course.ownerId,
      creationTime: course.creationTime
    });
    return true;
  } catch (error) {
    console.error('Error syncing course:', error);
    return false;
  }
};