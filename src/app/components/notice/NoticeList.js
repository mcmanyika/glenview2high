import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue, get, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../app/store';
import AddNoticeForm from '../../components/AddNoticeForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditNoticeForm from '../../components/EditNoticeForm';

const NoticeList = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [totalNotices, setTotalNotices] = useState(0);
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState(false);
  const [userType, setUserType] = useGlobalState('userType');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [accessLevel, setAccessLevel] = useState(0);
  const [isEditNoticeModalOpen, setIsEditNoticeModalOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage] = useState(10);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email;
          const userRef = ref(database, 'userTypes');

          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const users = snapshot.val();
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail);
            
            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType);
              setAccessLevel(userData.accessLevel || 0);

              if (userData.accessLevel === 5) {
                setSelectedComponent(
                  <div className="flex justify-between items-center dark:text-white">
                    <h2 className="text-lg font-bold">Notices</h2>
                    <button
                      onClick={() => setIsCreateNoticeModalOpen(true)}
                      className="bg-main3 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Create A Notice
                    </button>
                  </div>
                );
              }
            } else {
              console.log('No user found with this email.');
              // Handle redirection if necessary
            }
          } else {
            console.log('No userTypes found.');
            // Handle redirection if necessary
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
          setError('Error fetching user type. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserType();
    }
  }, [status, session]);

  useEffect(() => {
    const noticesRef = ref(database, 'notices');

    const unsubscribe = onValue(
      noticesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const noticesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Filter notices based on userType
          const filteredNotices = userType === 'student' 
            ? noticesArray.filter(notice => 
                notice.audience === 'all' || notice.audience === 'students'
              )
            : noticesArray;

          // Sort notices by date
          filteredNotices.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setNotices(filteredNotices);
          setTotalNotices(filteredNotices.length);
        } else {
          setNotices([]);
          setTotalNotices(0);
        }
      },
      (error) => {
        console.error(`Error fetching notices: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, [userType]);

  // Add pagination calculation
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  // Add pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-red-400',
      'bg-indigo-400',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDeleteNotice = async (noticeId) => {
    const confirmDelete = () => {
      toast.promise(
        async () => {
          const noticeRef = ref(database, `notices/${noticeId}`);
          await remove(noticeRef);
        },
        {
          pending: 'Deleting notice...',
          success: 'Notice deleted successfully!',
          error: 'Failed to delete notice. Please try again.'
        },
        {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    };

    toast.warn(
      <div>
        <p>Are you sure you want to delete this notice?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              confirmDelete();
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  const handleEditNotice = (notice, e) => {
    e.stopPropagation(); // Prevent modal from opening
    setNoticeToEdit(notice);
    setIsEditNoticeModalOpen(true);
  };

  return (
    <>
      <div className="w-full space-y-4 p-4 m-2 bg-white dark:bg-slate-900 rounded-xl transition-colors duration-200">
        {selectedComponent && (
          <div className="flex justify-between items-center dark:text-white">
            <h2 className="text-lg font-bold">Notices</h2>
            <button
              onClick={() => setIsCreateNoticeModalOpen(true)}
              className="bg-main3 hover:bg-main2 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
            >
              Create A Notice
            </button>
          </div>
        )}

        <div className="text-left">
          {notices.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentNotices.map((notice) => (
                      <tr 
                        key={notice.id}
                        onClick={() => handleNoticeClick(notice)}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${getRandomColor()} dark:bg-opacity-80 py-1 px-4 rounded-full text-white inline-block`}>
                            {formatDate(notice.date)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base text-gray-700 dark:text-gray-200">{notice.title}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {accessLevel === 5 && (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={(e) => handleEditNotice(notice, e)}
                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                title="Edit notice"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotice(notice.id);
                                }}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                                title="Delete notice"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Add pagination controls */}
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-main3 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    } transition-colors duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No notices available.</p>
          )}
        </div>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50 animate-fadeIn"
            onClick={() => setSelectedNotice(null)}
          >
            <div
              className="h-full w-full md:w-1/2 bg-white dark:bg-slate-800 shadow-xl p-8 border-l border-gray-100 dark:border-slate-700 transform transition-all duration-500 ease-out delay-150 animate-slideIn overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold dark:text-white mb-2">{selectedNotice.title}</h3>
                  <span className={`text-sm ${getRandomColor()} dark:bg-opacity-80 py-1 px-4 rounded-full text-white inline-block`}>
                    {formatDate(selectedNotice.date)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 bg-gray-50 dark:bg-slate-700/30 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.details}
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted on: {formatDate(selectedNotice.date)}
              </div>
            </div>
          </div>
        )}

        {/* Create Notice Modal */}
        {isCreateNoticeModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50 animate-fadeIn"
            onClick={() => setIsCreateNoticeModalOpen(false)}
          >
            <div
              className="h-full w-full md:w-1/2 bg-white dark:bg-slate-800 shadow-xl p-8 border-l border-gray-100 dark:border-slate-700 transform transition-all duration-500 ease-out delay-150 animate-slideIn overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AddNoticeForm onClose={() => setIsCreateNoticeModalOpen(false)} />
            </div>
          </div>
        )}

        {/* Edit Notice Modal */}
        {isEditNoticeModalOpen && noticeToEdit && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50 animate-fadeIn"
            onClick={() => setIsEditNoticeModalOpen(false)}
          >
            <div
              className="h-full w-full md:w-1/2 bg-white dark:bg-slate-800 shadow-xl p-8 border-l border-gray-100 dark:border-slate-700 transform transition-all duration-500 ease-out delay-150 animate-slideIn overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <EditNoticeForm 
                notice={noticeToEdit} 
                onClose={() => {
                  setIsEditNoticeModalOpen(false);
                  setNoticeToEdit(null);
                }} 
              />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default NoticeList;
