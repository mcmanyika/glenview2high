// Admissions.js
import React from 'react';
import Layout from '../app/components/Layout2';
import Image from 'next/image';

const Admissions = () => {
  return (
    <Layout templateText="Admissions">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative overflow-hidden">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674" 
                  alt="Admissions" 
                  fill
                  className="opacity-95 object-cover object-top"
                />
              </div>
            </div>
            {/* First Text Section */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Admissions Information</h2>
              <p className="text-xl font-thin mb-4">
                GlenView 2 High welcomes applications from students who are eager to learn, grow, and contribute to our diverse community. We offer a supportive environment that encourages academic excellence and personal development.
              </p>
            </div>
            {/* Second Text Section */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Enrollment Process</h2>
              <p className="text-xl font-thin mb-4">
                Our enrollment process is designed to be straightforward and transparent. Prospective students and their families can request here detailed information about application deadlines, required documents, and admission criteria.
              </p>
            </div>
            {/* Second Image Section */}
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative overflow-hidden">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.22.01%20AM.png?alt=media&token=7c2fb70f-bf2f-4b14-bbe4-fcb44575844c" 
                  alt="Enrollment" 
                  fill
                  className="opacity-95 object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admissions;
