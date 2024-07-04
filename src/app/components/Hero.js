'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Ensure you have heroicons installed
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have database imported from firebaseConfig

const Hero = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [titles, setTitles] = useState([]);

  const handleMenuClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const titleRef = ref(database, 'title'); // Reference to 'title' collection in Firebase
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active')); // Query to filter by status 'Active'

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title, // Adjust according to your database structure
                link: data[key].link,
                status: data[key].status, // Adjust according to your database structure
              }))
              .sort((a, b) => {
                if (a.title === 'Admissions') return 1; // Move 'Admissions' to the end
                if (b.title === 'Admissions') return -1; // Move 'Admissions' to the end
                return a.title.localeCompare(b.title); // Sort other titles alphabetically
              });
            setTitles(titlesArray);
          } else {
            setTitles([]); // Handle no data case
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
        // Handle error fetching data
      }
    };

    fetchData();
  }, []); // Ensure this effect runs only once on component mount

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674')"
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-15"></div>
      <div className="absolute top-4 right-4 z-20">
        <MenuIcon className="h-8 w-8 text-white cursor-pointer" onClick={handleMenuClick} />
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
          <div className="absolute top-4 right-4 z-60 text-white">
            <button onClick={handleMenuClick}>
              <XIcon className="h-8 w-8" />
            </button>
            
          </div>
          <div className="max-w-96 mx-auto text-center"> {/* Adjusted to center the list */}
              {titles.map((rw) => (
                <div key={rw.id}>
                  <Link href={`${rw.link}`}>
                    <div className="text-gray-300 hover:text-white text-3xl md:text-6xl uppercase p-3">{rw.title}</div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
      <section className="relative text-white p-10 md:p-20 text-center md:text-left">
        <h1 className="text-4xl md:text-4xl font-thin font-sans">Glenview 2 High - </h1>
        <p className="mt-4 text-sm md:text-xl md:text-thin">Empowering students to reach their full potential.</p>
      </section>
    </div>
  );
};

export default Hero;
