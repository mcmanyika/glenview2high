import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

const Alumni = () => {
  const router = useRouter(); // Initialize the router

  // Function to handle button click and redirect to /admin/login
  const handleRedirect = () => {
    router.push('/admin/login');
  };

  return (
    <section id="alumni" className="max-w-7xl mx-auto px-4 py-8 font-sans text-xl font-thin">
      {/* Flex Container for Cards */}
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        
        {/* Become a Mentor Card */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl text-center font-bold mb-4 uppercase">Become a Mentor</h2>
            <p className="text-lg mb-4">
              As a mentor, you’ll guide current students by sharing your knowledge, experience, and industry insights.
            </p>
            <ul className="mb-4 font-sans text-lg space-y-2">
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Offer Career Advice
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Provide Networking Opportunities
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Support Personal Development
              </li>
            </ul>
          </div>
          <button
            onClick={handleRedirect}
            className="bg-main text-white px-6 py-2 rounded hover:bg-yellow-800 mt-auto"
          >
            Become a Mentor
          </button>
        </div>

        {/* Support Our School Card */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl text-center font-bold mb-4 uppercase">Support Our School</h2>
            <p className="text-lg mb-4">
              There are several ways to give back to the school and help enhance the experience of current students. You can:
            </p>
            <ul className="mb-4 font-sans text-lg space-y-2">
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Donate to Scholarships
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Sponsor School Events
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-black mr-2" />
                Volunteer Your Time
              </li>
            </ul>
          </div>
          <button
            onClick={handleRedirect}
            className="bg-main text-white px-6 py-2 rounded hover:bg-yellow-800  mt-auto"
          >
            Support Our School
          </button>
        </div>

        {/* Give Back to the Community Card */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl text-center font-bold mb-4 uppercase">Give Back to the Community</h2>
            <p className="text-lg mb-4">
              Join fellow alumni in supporting local and global causes. You can participate in volunteer programs or contribute your expertise to various community projects.
            </p>
          </div>
          <button
            onClick={handleRedirect}
            className="bg-main text-white px-6 py-2 rounded hover:bg-yellow-800 mt-auto"
          >
            Join a Volunteer Program
          </button>
        </div>
      </div>
    </section>
  );
};

export default Alumni;
