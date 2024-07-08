'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Ensure you have heroicons installed
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have database imported from firebaseConfig

const Hero = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [titles, setTitles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Carousel index
  const [fadeIn, setFadeIn] = useState(true);
  const [carouselData, setCarouselData] = useState([
    {
      title: "Excellence in Education",
      description: "Empowering students to reach their full potential.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674",
    },
    {
      title: "Innovative Learning",
      description: "Providing state-of-the-art facilities and teaching methods.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674",
    },
    {
      title: "Community Engagement",
      description: "Building strong connections with the local community.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674",
    },
  ]);

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
                if (a.title === 'Alumni') return 1; // Move 'Alumni' to the end
                if (b.title === 'Alumni') return -1; // Move 'Alumni' to the end
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

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
        setFadeIn(true);
      }, 1000); // Match the duration of the fade-out effect
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const currentSlide = carouselData[currentIndex];

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-1000 ${fadeIn ? 'opacity-90' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${currentSlide.imageUrl})`
        }}
      ></div>
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${fadeIn ? 'opacity-15' : 'opacity-0'}`}></div>
      <div className="absolute top-4 right-4 z-20">
        <MenuIcon className="h-8 w-8 text-white cursor-pointer" onClick={handleMenuClick} />
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 transition-opacity duration-500">
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
      <section className={`relative text-white p-10 md:p-20 text-center md:text-left transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-5xl font-thin font-sans">{currentSlide.title}</h1>
        <p className="mt-4 text-sm md:text-xl text-thin font-sans">{currentSlide.description}</p>
      </section>
    </div>
  );
};

export default Hero;
