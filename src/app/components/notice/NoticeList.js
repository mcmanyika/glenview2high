import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const noticesRef = ref(database, 'notices');

    const unsubscribe = onValue(noticesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort notices by index in descending order
        noticesArray.sort((a, b) => b.id.localeCompare(a.id));

        // Limit to 10 notices
        const limitedNotices = noticesArray.slice(0, 10);

        setNotices(limitedNotices);
      } else {
        setNotices([]);
      }
    }, (error) => {
      console.error(`Error fetching notices: ${error.message}`);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-4 p-4 m-2">
        <div className=''>
        {notices.length > 0 ? (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice.id} className="p-1 pt-4 pb-4 border-b">
                <h3 className="text-xl font-medium">{notice.title}</h3>
                <p className="text-base text-gray-700">{notice.details}</p>
                <p className="text-sm text-gray-500">Posted by: {notice.postedBy}</p>
                <p className="text-sm text-gray-500">Date: {notice.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notices available.</p>
        )}
      </div>
    </div>
  );
};

export default NoticeList;
