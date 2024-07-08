import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have firebaseConfig set up properly

const Header = () => {
  const [titles, setTitles] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleRef = ref(database, 'title'); // Reference to 'title' collection in Firebase
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active')); // Query to filter by status 'Active'

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
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

    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed z-50 w-full bg-gray-700 opacity-80 text-white transition-all duration-500 ease-in-out ${
        isSticky ? 'top-0 p-4 ' : 'bottom-0 border-t-2 border-t-gray-500 p-10'
      }`}
    >
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <div className={`flex items-center space-x-2 ${isOpen ? 'hidden md:flex' : 'block'}, `}>
          <Link href='/'>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={isSticky ? 50 : 70} // Adjusted width based on sticky state
              height={isSticky ? 50 : 80} // Adjusted height based on sticky state
              className={`rounded `}
            />
          </Link>
          <h1 className={`text-sm md:text-2xl font-normal uppercase ${isSticky ? 'hidden': ''}`}>GlenView 2 High</h1>
        </div>
        {isSticky && (
          <div className="md:hidden"> {/* Display menu icon on mobile */}
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        )}
        <ul className={`md:hidden ${isOpen ? 'flex' : 'flex'} mt-4`} onClick={toggleMenu}>
          {titles.map((rw) => (
            <li key={rw.id} className="py-2 px-4 hover:text-gray-300 font-sans font-thin">
              <Link href={`${rw.link}`}>
                <span>{rw.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="hidden md:flex space-x-4"> {/* Hide on mobile, show on medium screens and above */}
          {titles.map((rw) => (
            <li key={rw.id}>
              <Link href={`${rw.link}`}>
                <div className="hover:text-gray-300 font-sans font-thin">{rw.title}</div>
              </Link>
            </li>
          ))}
          {/* <li>
            {session ? (
              <button onClick={() => signOut('google')}>Sign Out </button>
            ) : (
              <button onClick={() => signIn('google')}>Sign In </button>
            )}
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
