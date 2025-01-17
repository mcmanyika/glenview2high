import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../app/store';
import AddNoticeForm from '../../components/AddNoticeForm';

const NoticeList = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [totalNotices, setTotalNotices] = useState(0);
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState(false);
  const [userType, setUserType] = useGlobalState('userType');

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

              if (userData.userType !== 'student') {
                setSelectedComponent(
                  <div className="flex justify-between items-center">
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

  return (
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
                className="p-4 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 transition-colors duration-200"
              >
                <button
                  className={`text-sm ${getRandomColor()} dark:bg-opacity-80 p-2 mb-3 px-6 rounded-full text-white shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  {formatDate(notice.date)}
                </button>
                <p className="text-base text-gray-700 dark:text-gray-200">{notice.details}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No notices available.</p>
        )}
      </div>

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
  );
};

export default NoticeList;
