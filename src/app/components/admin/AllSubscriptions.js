import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';

const AllSubscriptions = () => {
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this number

  useEffect(() => {
    const fetchAllSubscriptions = async () => {
      try {
        const studentsRef = ref(database, 'students');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const studentsData = snapshot.val();
          const studentsArray = Object.entries(studentsData).map(([studentId, studentData]) => ({
            ...studentData,
            studentId,
            subscription: studentData.subscription || {},
          }));
          
          studentsArray.sort((a, b) => 
            new Date(b.timestamp || b.submittedAt) - new Date(a.timestamp || a.submittedAt)
          );
          
          setAllSubscriptions(studentsArray);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSubscriptions();
  }, []);

  const filteredSubscriptions = allSubscriptions.filter(student => {
    const matchesSearch = 
      student.subscription.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subscription.confirmationId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      student.subscription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500'
          }`}
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500'
          }`}
        >
          Previous
        </button>
        
        <span className="px-3 py-1 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500'
          }`}
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500'
          }`}
        >
          Last
        </button>
      </div>
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const updates = {
        [`students/${selectedStudent.studentId}/subscription/status`]: newStatus,
        [`students/${selectedStudent.studentId}/subscription/updatedAt`]: new Date().toISOString(),
      };
      
      await update(ref(database), updates);
      
      setAllSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(student => 
          student.studentId === selectedStudent.studentId
            ? {
                ...student,
                subscription: {
                  ...student.subscription,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              }
            : student
        )
      );
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <FaSpinner className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  if (allSubscriptions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No subscriptions found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          All Student Subscriptions
        </h3>
        
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by email or confirmation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {currentItems.map((student, index) => (
            <div 
              key={index}
              className="border dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
              onClick={() => {
                setSelectedStudent(student);
                setIsModalOpen(true);
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Confirmation ID
                  </p>
                  <p className="font-medium text-gray-600">
                    {student.subscription.confirmationId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium dark:text-white">
                    {student.subscription.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted At
                  </p>
                  <p className="font-medium dark:text-white">
                    {(student.subscription.timestamp || student.subscription.updatedAt)
                      ? format(new Date(student.subscription.timestamp || student.subscription.updatedAt), 'MMM d, yyyy HH:mm')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Next Payment
                  </p>
                  <p className="font-medium dark:text-white">
                    {student.subscription?.endDate 
                      ? format(new Date(student.subscription.endDate), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className={`font-medium capitalize ${
                    student.status === 'approved' 
                      ? 'text-green-600 dark:text-green-400' 
                      : student.status === 'rejected'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {student.subscription.status || 'pending'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination />
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Update Subscription Status
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium dark:text-white">{selectedStudent.subscription.email}</p>
            </div>

            <div className="space-y-2">
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updatingStatus}
                  className={`w-full py-2 px-4 rounded-lg capitalize
                    ${selectedStudent.subscription.status === status 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updatingStatus ? (
                    <FaSpinner className="animate-spin inline mr-2" />
                  ) : null}
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              disabled={updatingStatus}
              className="mt-4 w-full py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubscriptions; 