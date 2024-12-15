import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaEnvelope, FaBell, FaSun, FaMoon } from 'react-icons/fa'; // Updated icons
import { useGlobalState } from '../../store';
import Modal from './utils/Modal'; // Import Modal component
import NoticeList from './NoticeList'; // Import the NoticeList component
import { useTheme } from 'next-themes';

const NoticeCount = () => {
  const [totalNotices, setTotalNotices] = useState(0);
  const [routineCount] = useGlobalState('routineCount'); // Access routineCount from global state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const noticesRef = ref(database, 'notices');

    const unsubscribe = onValue(noticesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Update total notices count
        setTotalNotices(noticesArray.length);
      } else {
        setTotalNotices(0);
      }
    }, (error) => {
      console.error(`Error fetching notices: ${error.message}`);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex">
      <div className="relative link cursor-pointer flex items-center p-2 mr-4" onClick={() => setIsModalOpen(true)}>
        <span className="absolute top-0 right-4 md:left-6 h-6 w-6 border-2 border-white bg-blue-400 text-center rounded-full text-white font-bold">
          {totalNotices}
        </span>
        <FaEnvelope className="h-7 w-7 text-gray-400" />
      </div>
      <div className="relative link cursor-pointer flex items-center p-2 mr-4">
        <span className="absolute top-0 right-2 md:left-5  h-6 w-6 border-2 border-white bg-red-400 text-center rounded-full text-white font-bold">
          {routineCount}
        </span>
        <FaBell className="h-7 w-7 text-gray-400" />
      </div>
      {/* <div>
      <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center w-full p-2 text-gray-500 dark:text-gray-300"
                >
                  {theme === 'dark' ? (
                    <>
                      <FaSun className="h-7 w-7 mr-2" /> 
                    </>
                  ) : (
                    <>
                      <FaMoon className="h-7 w-7 mr-2" />
                    </>
                  )}
                </button>
      </div> */}
      {/* Modal for Notices */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Notices</h2>
        <NoticeList />
      </Modal>
    </div>
  );
};

export default NoticeCount;
