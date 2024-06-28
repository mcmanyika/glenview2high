'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlobeAltIcon } from '@heroicons/react/24/outline'; // Import the GlobeAltIcon from Heroicons v2
import Image from 'next/image'; // Import Image component from Next.js

const Header = () => {
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
      className={`fixed z-50 w-full bg-blue  text-white transition-all duration-500 ease-in-out ${
        isSticky ? 'top-0 p-4' : 'bottom-0 p-10'
      }`}
    >
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={isSticky ? 50 : 80} // Adjusted height based on sticky state
            height={isSticky ? 50 : 80} // Adjusted height based on sticky state
            className="rounded"
          />
          <h1 className="text-sm md:text-2xl font-normal uppercase">GlenView 2 High</h1>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about">
              <div className="hover:underline">About</div>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <div className="hover:underline">Contact</div>
            </Link>
          </li>
          <li>
            <a
              href="https://www.facebook.com/your-school-page"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 flex items-center space-x-2"
            >
              <span className="sr-only">Facebook</span>
              <GlobeAltIcon className="h-6 w-6" aria-hidden="true" />
              <span>Facebook</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
