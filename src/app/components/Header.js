'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useGlobalState, setGlobalState } from '../store';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const session = useSession();
  const [user] = useGlobalState('user');

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
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

  return (
    <header
      className={`fixed z-50 w-full bg-blue text-white transition-all duration-500 ease-in-out ${
        isSticky ? 'top-0 p-4 ' : 'bottom-0 border-t-4 border-t-white p-10'
      }`}
    >
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={isSticky ? 50 : 80} // Adjusted width based on sticky state
            height={isSticky ? 50 : 80} // Adjusted height based on sticky state
            className="rounded"
          />
          <h1 className="text-sm md:text-2xl font-normal uppercase">GlenView 2 High</h1>
        </div>
        <ul className="hidden md:flex space-x-4"> {/* Hide on mobile, show on medium screens and above */}
          <li>
            <Link href="/about">
              <div>About</div>
            </Link>
          </li>
          <li>
            <Link href="/academics">
              <div>Academics</div>
            </Link>
          </li>
          <li>
            <Link href="/sports">
              <div>Sports</div>
            </Link>
          </li>
          <li>
            <Link href="/admissions">
              <div>Admissions</div>
            </Link>
          </li>
          <li>
              {session ? 
                <><button onClick={() => signOut('google')}>Sign Out </button></>
                :
                <><button onClick={() => signIn('google')}>Sign In </button></>  
            }
              
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
