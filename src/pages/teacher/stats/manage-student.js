'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../../utils/withAuth';
import AdminLayout from '../../admin/adminLayout';
import StudentStatsManager from '../../../app/components/teachers/stats/ StudentStatsManager';
import { ref, get } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const ManageStudent = () => {
  const { data: session } = useSession();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = ref(database, 'userTypes');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const studentsData = Object.entries(snapshot.val())
            .filter(([_, user]) => user.userType === 'student')
            .map(([id, user]) => ({
              id,
              name: `${user.firstName} ${user.lastName}`,
              class: user.class
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setStudents(studentsData);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Manage Student Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a student to manage their dashboard statistics and academic progress.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Student
          </label>
          <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 pr-10 max-w-md rounded-lg border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm appearance-none focus:border-main3 focus:ring-main3"
            >
                <option value="">Choose a student</option>
                {students.map((student) => (
                <option key={student.id} value={student.id}>
                    {student.name} - Class {student.class}
                </option>
                ))}
            </select>
        </div>

        {selectedStudent && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md">
            <StudentStatsManager studentId={selectedStudent} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default withAuth(ManageStudent);