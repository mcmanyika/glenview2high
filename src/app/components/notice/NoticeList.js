import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue, get, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../app/store';
import AddNoticeForm from '../../components/AddNoticeForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

          noticesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
          const limitedNotices = noticesArray.slice(0, 10);

          setNotices(limitedNotices);
          setTotalNotices(limitedNotices.length);
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
  }, []);

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
            <ul className="space-y-4">
              {notices.map((notice) => (
                <li 
                  key={notice.id} 
                  className="p-4 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 transition-colors duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex justify-between items-start">
                    <button
                      className={`text-sm ${getRandomColor()} dark:bg-opacity-80 p-2 mb-3 px-6 rounded-full text-white shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                      {formatDate(notice.date)}
                    </button>
                    {accessLevel === 5 && (
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
                    )}
                  </div>
                  <p className="text-base text-gray-700 dark:text-gray-200">{notice.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No notices available.</p>
          )}
        </div>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedNotice(null)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 w-3/4 max-w-2xl border border-gray-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">{selectedNotice.title}</h3>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <p className="text-gray-600 dark:text-gray-300">{selectedNotice.details}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Posted on: {formatDate(selectedNotice.date)}
              </div>
            </div>
          </div>
        )}

        {isCreateNoticeModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setIsCreateNoticeModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 w-3/4 max-w-2xl border border-gray-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <AddNoticeForm onClose={() => setIsCreateNoticeModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default NoticeList;
