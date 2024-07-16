import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);

  useEffect(() => {
    const noticesRef = ref(database, 'notices');

    const unsubscribe = onValue(noticesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort notices by date in descending order
        noticesArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limit to 10 notices
        const limitedNotices = noticesArray.slice(0, 10);

        setNotices(limitedNotices);
        setTotalNotices(limitedNotices.length); // Update total notices count
      } else {
        setNotices([]);
        setTotalNotices(0);
      }
    }, (error) => {
      console.error(`Error fetching notices: ${error.message}`);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to format date to "day, month year"
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Function to generate a random color from a predefined list
  const getRandomColor = () => {
    const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400', 'bg-indigo-400'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className="space-y-4 p-4 m-2">
      <div className="">
        {notices.length > 0 ? (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice.id} className="p-1 pt-2 pb-4 border-b">
                <button className={`text-sm ${getRandomColor()} p-2 mb-3 pl-6 pr-6 rounded-2xl text-white`}>{formatDate(notice.date)}</button>
                <p className="text-base text-gray-700">{notice.details}</p>
                <p className="text-sm text-gray-500">{notice.postedBy}</p>
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
