import React, { useState, useEffect } from 'react';
import { ref, push, onValue, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

const CreateAssignment = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [classes, setClasses] = useState([]);
  const [formValues, setFormValues] = useState({
    assignmentName: '',
    assignmentDueDate: '',
    assignmentClass: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const userEmail = session.user.email;
      setEmail(userEmail);

      const classesRef = ref(database, 'classes');
      onValue(classesRef, (snapshot) => {
        const classesData = snapshot.val();
        if (classesData) {
          const userClasses = Object.keys(classesData)
            .filter((key) => classesData[key].teacherEmail === userEmail)
            .map((key) => ({
              id: key,
              ...classesData[key],
            }));
          setClasses(userClasses);
        }
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      description: content,
    }));
  };

  const handleCreateAssignment = async () => {
    const { assignmentName, assignmentClass, assignmentDueDate, description } = formValues;

    if (!assignmentName || !assignmentClass || !assignmentDueDate || !description) {
      toast.error('Please fill out all fields before creating the assignment.');
      return;
    }

    setIsLoading(true);
    try {
      const assignmentsRef = ref(database, 'assignment');
      const newAssignment = {
        email,
        assignmentName,
        assignmentClass,
        createdDate: Date.now(),
        assignmentDueDate,
        description,
      };

      const assignmentSnapshot = await push(assignmentsRef, newAssignment);
      const assignmentId = assignmentSnapshot.key;

      const studentsRef = ref(database, 'userTypes');
      onValue(studentsRef, (snapshot) => {
        const studentsData = snapshot.val();
        if (studentsData) {
          const studentsInClass = Object.keys(studentsData)
            .filter((key) => studentsData[key].studentClassLevel === assignmentClass)
            .map((key) => ({ id: key, ...studentsData[key] }));

          studentsInClass.forEach((student) => {
            const studentRef = ref(database, `userTypes/${student.id}/assignments/${assignmentId}`);
            update(studentRef, {
              assignmentId: assignmentId,
              status: 'Assigned',
            });
          });
        }
      });

      setFormValues({
        assignmentName: '',
        assignmentDueDate: '',
        assignmentClass: '',
        description: '',
      });
      toast.success('Assignment created and successfully assigned to students!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Error creating assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-sm mx-auto bg-white  rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Assignment</h2>
      <div className="flex">
        <div className="flex-1 mb-4 mr-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Due Date</label>
          <input
            type="date"
            name="assignmentDueDate"
            value={formValues.assignmentDueDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex-1 mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
          <select
            name="assignmentClass"
            value={formValues.assignmentClass}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Class</option>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <option key={cls.id} value={cls.className}>
                  {cls.className}
                </option>
              ))
            ) : (
              <option disabled>No classes available</option>
            )}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Title</label>
        <input
          type="text"
          name="assignmentName"
          value={formValues.assignmentName}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <SunEditor
          setContents={formValues.description}
          onChange={handleDescriptionChange}
          setOptions={{
            height: 350,
            buttonList: [
              ['undo', 'redo', 'bold', 'italic', 'underline'],
              ['list', 'align', 'fontSize'],
              ['link', 'image', 'video'],
              ['preview', 'print'],
            ],
          }}
        />
      </div>
      <input type="hidden" value={email} readOnly />
      <button
        onClick={handleCreateAssignment}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isLoading ? 'cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Assignment...' : 'Create Assignment'}
      </button>
    </div>
  );
};

export default CreateAssignment;
