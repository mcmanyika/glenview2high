import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database'; // Import Firebase database functions
import { database } from '../../../utils/firebaseConfig'; // Adjust path to your firebaseConfig
import { FaFacebook } from 'react-icons/fa';

const Socials = () => {
  const [facebookContent, setFacebookContent] = useState(''); // State to hold the Facebook URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRef = ref(database, 'account');
        const snapshot = await get(accountRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setFacebookContent(data.facebook || ''); // Set Facebook URL if it exists
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData(); // Fetch the data on component mount
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue2/50 to-blue2 py-12">
      <div className="max-w-48 mx-auto">
        <h2 className="text-lg font-light mb-8 text-center bg-black/90 text-white p-3 uppercase tracking-wider
                     transform hover:scale-105 transition-all duration-300 rounded-sm">
          Follow Us
        </h2>
      </div>
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-center space-x-8">
          {facebookContent && (
            <a
              href={facebookContent}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transform hover:scale-110 
                       transition-all duration-300 hover:rotate-6"
            >
              <FaFacebook className="h-10 w-10" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Socials;
