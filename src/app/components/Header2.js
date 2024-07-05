// Import necessary dependencies
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useSession, signIn, signOut } from 'next-auth/react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have firebaseConfig set up properly

const Header2 = () => {
  // const session = useSession();
  const [titles, setTitles] = useState([]);

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

  return (
    <header className="fixed top-0 z-50 w-full bg-blue text-white p-4 transition-all duration-500 ease-in-out">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Link href='/'>
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={50} // Adjusted width for a consistent size
                    height={50} // Adjusted height for a consistent size
                    className="rounded"
                />
          </Link>
          <h1 className="text-sm md:text-2xl font-normal uppercase">GlenView 2 High</h1>
        </div>
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
        <div className="md:hidden">
          {/* Mobile menu button can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header2;
