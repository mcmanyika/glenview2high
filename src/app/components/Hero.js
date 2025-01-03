import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useGlobalState, setIsOverlayVisible } from '../store'; // Adjust the path to your global state management file
import { XIcon } from '@heroicons/react/outline';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Image from 'next/image';

const Hero = () => {
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');
  const [titles, setTitles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselData = [
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8822.jpg?alt=media&token=ebcf6712-adbd-404e-b988-6121b194b57b",
    },
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8927.jpg?alt=media&token=08df172a-dfce-4537-aad9-d3cd6b56bacd",
    },
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8900.jpg?alt=media&token=7c849e1e-fd70-408a-95fa-1071650dc66c",
    },
   
  ];

  // Function to handle menu click and toggle overlay visibility
  const handleMenuClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchData = () => {
      try {
        const titleRef = ref(database, 'title');
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active'));

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
                category: data[key].category,
              }))
              .filter(a => a.category === 'title')
              .sort((a, b) => {
                if (a.title === 'Admissions') return 1;
                if (b.title === 'Admissions') return -1;
                if (a.title === 'Alumni') return 1;
                if (b.title === 'Alumni') return -1;
                return a.title.localeCompare(b.title);
              });
            setTitles(titlesArray);
          } else {
            setTitles([]);
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // Carousel logic to change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const currentSlide = carouselData[currentIndex];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex transition-transform duration-[2000ms] ease-out" style={{ transform: `translateX(${currentIndex * -100}%)` }}>
        {carouselData.map((slide, index) => (
          <div key={index} className="min-w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-[2000ms]" style={{ backgroundImage: `url(${slide.imageUrl})`, filter: 'brightness(0.85)' }}></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 transition-transform hover:scale-105">
        <Link href="/" className="block"> 
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded w-16 h-16 md:w-28 md:h-28 transition-all duration-300"
            onClick={handleMenuClick}
          />
        </Link>
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
          <div className="absolute top-4 right-4 text-white">
            <button onClick={handleMenuClick}>
              <XIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="max-w-96 mx-auto text-center">
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
      <section className="relative text-white p-10 md:p-20 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-thin font-sans tracking-wider animate-fade-in">
          {currentSlide.title}
        </h1>
        <p className="mt-6 text-base md:text-2xl font-light leading-relaxed animate-fade-in-delayed">
          {currentSlide.description}
        </p>
      </section>
    </div>
  );
};

export default Hero;
