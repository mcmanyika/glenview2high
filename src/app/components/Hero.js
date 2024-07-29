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
      title: "Excellence in Education",
      description: "Empowering students to reach their full potential.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents3.jpeg?alt=media&token=368a73f2-a805-4330-85b6-24be48315e97",
    },
    {
      title: "Innovative Teaching",
      description: "Providing state-of-the-art facilities and teaching methods.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fcomputerlab.jpeg?alt=media&token=af04fc07-062b-412c-a9ce-a17bed728757",
    },
    {
      title: "Sporting Activities",
      description: "Building strong connections with the local community.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fnetball.jpeg?alt=media&token=af4ee37f-7f9e-46d1-b823-d7ece81bcac8",
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
      <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(${currentIndex * -100}%)` }}>
        {carouselData.map((slide, index) => (
          <div key={index} className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${slide.imageUrl})` }}></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-blue-500 opacity-20"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <Link href="/">
          <Image
            src="/images/logo.png" // Replace with your logo path
            alt="Logo"
            width={100}
            height={100}
            className="rounded w-12 h-12 md:w-24 md:h-24"
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
      <section className="relative text-white p-10 md:p-20 text-center">
        <h1 className="text-2xl md:text-5xl font-thin font-sans">{currentSlide.title}</h1>
        <p className="mt-4 text-sm md:text-xl text-thin">{currentSlide.description}</p>
      </section>
    </div>
  );
};

export default Hero;
