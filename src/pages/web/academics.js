// Academics.js
import React from 'react';
import Layout from '../../app/components/Layout2';
import Image from 'next/image';
import Subjects from '../../app/components/Subjects'


const Academics = () => {
  return (
    <Layout templateText="Academics">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96  relative">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8942.jpg?alt=media&token=eeddcc3d-aada-436a-85b7-76fb894a1d43" 
                  alt="Academic 1" 
                  fill
                  className="opacity-95 object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-blue-500 opacity-20"></div>
            </div>
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our Programs</h2>
              <p className="text-xl font-thin mb-4">
              The school has won several performances awards. Glen View 2 Secondary is rated among the best schools in the province because of good pass-rate both ‘O’ and ‘A’ Level, and the general outlook of the premises and grounds. Team-work drives the school forward in a successful way.
              </p>
            </div>
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Student Achievements</h2>
              <p className="text-xl font-thin mb-4">
              The school has a perennial history of excelling in sporting and cultural activities. This is evidenced by several awards it has received this year at different levels. It has received awards in various sporting activities at area and district levels.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8735.jpg?alt=media&token=57d5a57f-0333-4e5c-87f3-be7e9474fe6f" 
                  alt="Academic 2" 
                  fill
                  className="opacity-95 object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-blue-500 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      <Subjects />
    </Layout>
  );
};

export default Academics;
