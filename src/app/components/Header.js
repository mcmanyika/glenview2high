// components/Header.js

import { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaInstagram, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { useGlobalState, setIsOverlayVisible } from '../store';
import { signIn, signOut } from 'next-auth/react';

const Header = ({ session }) => {
  const [titles, setTitles] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');

  useEffect(() => {
    const fetchData = async () => {
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
              .filter(a => a.title !== 'Projects')
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

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <header
      className={`fixed z-50 w-full bg-main text-white transition-all duration-500 ease-in-out ${
        isSticky ? 'top-0' : 'bottom-0 border-t-2 border-t-white p-5'
      } ${!isSticky && 'hidden md:block'}`}
    >
      {isSticky && (
        <div className='top-0 w-full text-white p-0'>
          <div className='container mx-auto flex text-sm font-thin p-2 mb-2 justify-between'>
            <div className='flex-1 md:flex space-x-2 hidden'>
              <span>Follow Us</span>
              <a
                href="https://www.facebook.com/DivarisMakahariscollege/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-900"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              {/* <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-900"
              >
                <FaInstagram className="h-5 w-5" />
              </a> */}
            </div>
            <div className='flex-1 text-right relative'>
              {session ? (
                <>
                  <span onClick={togglePopover} className="cursor-pointer">
                    Hi {session.user.name}
                  </span>
                  {showPopover && (
                    <div ref={popoverRef} className="absolute right-0 mt-2 w-48 bg-white text-black p-2 rounded shadow-md">
                      <Link href="/admin/dashboard">
                        <p
                          className="text-sm text-left flex items-center cursor-pointer"
                          onClick={() => setShowPopover(false)}
                        >
                          <FaHome className="mr-2" /> Dashboard
                        </p>
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="mt-4 w-full bg-main text-white p-1 rounded "
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  Welcome Guest, &nbsp;
                  <button
                    onClick={() => signIn('google')}
                    className=" text-white p-1 rounded hover:bg-main2"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <nav className="max-w-4xl mx-auto flex justify-between items-center p-4">
        <div className={`flex items-center space-x-2 ${isOpen ? 'hidden md:flex' : 'block'}`}>
          {/* <Link href='/'>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={isSticky ? 50 : 70}
              height={isSticky ? 50 : 80}
              className="rounded"
              priority
            />
          </Link> */}
          <h1 className="text-sm md:text-2xl font-normal uppercase flex">Divaris Makaharis High</h1>
        </div>
        {isSticky && (
          <div className="md:hidden">
            <button onClick={toggleOverlay} className="text-white focus:outline-none">
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
        <ul className="hidden md:flex space-x-4">
          {titles.length > 0 && titles.map((rw) => (
            <li key={rw.id}>
              <Link href={`${rw.link}`} passHref>
                <div className="hover:text-gray-300 text-sm font-sans font-thin uppercase pb-2 border-b-2 border-transparent hover:border-gray-300 transition duration-300">
                  {rw.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
