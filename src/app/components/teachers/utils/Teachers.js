import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';

const Teachers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const usersArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key].profile // Adjusting to fetch profile data
            }));
            setUsers(usersArray);
          } else {
            console.log('No users data found.');
          }
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return <div className="text-center mt-4">No users found.</div>;
  }

  return (
    <div className="w-full text-sm p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Student ID</th>
              <th className="p-2 border-b">First Name</th>
              <th className="p-2 border-b">Last Name</th>
              <th className="p-2 border-b">Gender</th>
              <th className="p-2 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border-b">{user.studentId || 'N/A'}</td>
                <td className="p-2 border-b">{user.firstName || 'N/A'}</td>
                <td className="p-2 border-b">{user.lastName || 'N/A'}</td>
                <td className="p-2 border-b capitalize">{user.gender || 'N/A'}</td>
                <td className="p-2 border-b">{user.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
