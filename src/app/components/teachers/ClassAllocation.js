'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClassAllocation = () => {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [className, setClassName] = useState('');
  const [teacherDetails, setTeacherDetails] = useState({ firstName: '', lastName: '', email: '', userID: '' });
  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch teachers from 'userTypes' where userType is 'teacher'
      const fetchTeachers = async () => {
        try {
          const teachersRef = ref(database, 'userTypes');
          onValue(teachersRef, (snapshot) => {
            const teachersData = snapshot.val();
            if (teachersData) {
              const teachersArray = Object.keys(teachersData).map((key) => ({
                id: key,
                ...teachersData[key],
              }));
              const filteredTeachers = teachersArray.filter((teacher) => teacher.userType === 'teacher');
              setTeachers(filteredTeachers);
            }
          });
        } catch (error) {
          console.error('Error fetching teachers:', error);
        } finally {
          setIsLoading(false);
        }
      };

      // Fetch class options from 't_dict' where category is 'level'
      const fetchClassOptions = async () => {
        try {
          const classOptionsRef = ref(database, 't_dict');
          onValue(classOptionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const optionsArray = Object.keys(data)
                .map((key) => data[key])
                .filter((item) => item.category === 'level')
                .map((item) => item.title);
              setClassOptions(optionsArray);
            }
          });
        } catch (error) {
          console.error('Error fetching class options:', error);
        }
      };

      fetchTeachers();
      fetchClassOptions();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    if (!className || !selectedTeacher) {
      toast.error("Please select a class name and a teacher.");
      return;
    }

    const uploadedBy = session?.user?.email || '';
    const classData = {
      className,
      uploadedBy,
      teacherFirstName: teacherDetails.firstName,
      teacherLastName: teacherDetails.lastName,
      teacherEmail: teacherDetails.email,
      teacherID: teacherDetails.userID,
    };

    try {
      await push(ref(database, 'classes'), classData);
      toast.success("Class name uploaded successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (error) {
      console.error("Error uploading class name: ", error);
      toast.error("Failed to upload class name. Please try again.");
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher.id);
    setTeacherDetails({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      userID: teacher.id,
    });
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (teachers.length === 0) {
    return <div className="text-center mt-4">No teachers found.</div>;
  }

  return (
    <div className="w-full text-sm p-4 bg-white">
      <div className="text-xl font-bold pb-4">Allocate Teacher To Class</div>

      {/* Select Teacher */}
      <select
        value={selectedTeacher}
        onChange={(e) => handleTeacherSelect(teachers.find(teacher => teacher.id === e.target.value))}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      >
        <option value="" disabled>Select a Teacher...</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {`${teacher.firstName || 'N/A'} ${teacher.lastName || 'N/A'}`}
          </option>
        ))}
      </select>

      <div className="bg-white border shadow-sm rounded p-4 ml-0 m-2">
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <div className="mt-2 grid grid-cols-3 gap-4">
            {classOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={option}
                  checked={className === option}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-4 h-4 rounded-none mr-2"
                />
                <span className="text-base">{option}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full  hover:bg-blue-600 transition-colors"
          >
            Allocate Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClassAllocation;
