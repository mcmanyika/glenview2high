import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database'; // Import Firebase database functions
import { database } from '../../../utils/firebaseConfig'; // Adjust path to your firebaseConfig

const About = () => {
  const [aboutContent, setAboutContent] = useState(''); // State to hold the "about" content

  useEffect(() => {
    const fetchAboutContent = async () => {
      const aboutRef = ref(database, 'account/mission'); // Reference to the 'account/about' node
      const snapshot = await get(aboutRef);

      if (snapshot.exists()) {
        setAboutContent(snapshot.val()); // Set the fetched content to state
      } else {
        console.log('No about content found');
      }
    };

    fetchAboutContent(); // Fetch the content on component mount
  }, []);

  return (
    <section id='about'>
      <div className="bg-blue2 pt-10">
        <div className='max-w-60 mx-auto '>
          <h2 className="text-lg font-thin text-center bg-black text-white p-2 uppercase">About Us</h2>
        </div>
        <div className="max-w-3xl mx-auto p-8">
          <p className='text-center font-sans text-xl font-thin'>
            {aboutContent || ''} {/* Display the content or a fallback while loading */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
