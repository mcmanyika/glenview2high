import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have firebaseConfig set up properly

const Header2 = () => {
  const [titles, setTitles] = useState([]);
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
  }, []);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-blue text-white p-4 transition-all duration-500 ease-in-out">
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center w-4/5 space-x-2">
          <Link href='/'>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded"
            />
          </Link>
          {/* Toggle visibility based on isOpen state */}
          <h1 className={`text-sm md:text-2xl font-normal uppercase ${isOpen ? 'hidden' : 'block'}`}>GlenView 2 High</h1>
        </div>
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
        <ul className={`md:flex ${isOpen ? 'flex' : 'hidden'} md:space-x-4 md:w-full mt-4 md:mt-0 text-right`}>
          {titles.map((rw) => (
            <li key={rw.id}>
              <div className="cursor-pointer py-2 px-4 hover:text-gray-300 font-sans font-thin" onClick={toggleMenu}>
                <Link href={`${rw.link}`}>
                  <span>{rw.title}</span>
                </Link>
              </div>
            </li>
          ))}
          {/* Example session handling */}
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

export default Header2;
