// components/student/NoticeCount.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { useGlobalState } from '../../store';

const NoticeCount = () => {
  const [totalNotices, setTotalNotices] = useState(0);
  const [routineCount] = useGlobalState('routineCount'); // Access routineCount from global state

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
    <div className="w-full flex flex-col md:flex-row text-center">
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <MdOutlineLibraryBooks className='w-16 h-16 rounded-full bg-blue-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Notifications <br />{totalNotices}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <FaCalendarAlt className='w-16 h-16 rounded-full bg-orange-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Events <br />{totalNotices}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0 ">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <FaClipboardList className='w-16 h-16 rounded-full bg-purple-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Upcoming Classes <br />{routineCount}
        </div>
      </div>
    </div>
  );
};

export default NoticeCount;
