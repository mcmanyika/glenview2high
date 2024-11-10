import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database'; // Import Firebase database functions
import { database } from '../../../utils/firebaseConfig'; // Adjust path to your firebaseConfig
import { FaFacebook } from 'react-icons/fa';

const Socials = () => {
  const [facebookContent, setFacebookContent] = useState(''); // State to hold the "about" content

  useEffect(() => {
    const fetchFacebookContent = async () => {
      const facebookRef = ref(database, 'account'); // Reference to the 'account/about' node
      const snapshot = await get(facebookRef);

      if (snapshot.exists()) {
        setFacebookContent(snapshot.val()); // Set the fetched content to state
      } else {
        console.log('No about content found');
      }
    };

    fetchFacebookContent(); // Fetch the content on component mount
  }, []);
  return (
    <div className="bg-blue2 p-6">
        <div className='max-w-40 mx-auto'>
        <h2 className="text-lg  font-thin mb-6 text-center bg-black text-white p-2 uppercase">Follow Us</h2></div>
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-center space-x-6">
          <a
            href={facebookContent}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaFacebook className="h-8 w-8" />
          </a>
         
        </div>
      </div>
    </div>
  );
};

export default Socials;
