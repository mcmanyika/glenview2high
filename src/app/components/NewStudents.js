import React from 'react';
import Link from 'next/link'; // Import Link from Next.js for navigation

const NewStudents = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('images/book.png')" }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <section className="relative text-white p-20 md:p-15 text-center">
        <h1 className="text-xl md:text-3xl font-thin font-sans uppercase">Welcome New Students</h1>
        <p className="mt-4 text-base md:text-lg">
          {/* Use Link component for navigation */}
          <Link href="/web/admissions">
            <button className="uppercase p-2 bg-blue-400 text-white hover:bg-blue-500 transition duration-300">
              Find out more
            </button>
          </Link>
        </p>
      </section>
    </div>
  );
};

export default NewStudents;
