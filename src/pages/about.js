import React from 'react';
import Layout from '../app/components/Layout2';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <Layout templateText="About Us">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image 1 */}
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 mb-5 relative">
                <Image 
                  src="/images/fountain.png" 
                  alt="Fountain" 
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                />
              </div>
            </div>
            {/* Our History */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our History</h2>
              <p className="text-xl font-thin mb-4">
                Established in 1990, GlenView 2 High has a rich history of nurturing students and helping them achieve their dreams. Over the years, our school has grown and evolved, but our core values of integrity, respect, and excellence have remained constant.
              </p>
            </div>
            {/* Our Vision */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
              <p className="text-xl font-thin mb-4">
                Our vision is to be a leading educational institution that inspires students to be innovative thinkers, responsible global citizens, and lifelong learners.
              </p>
            </div>
            {/* Image 2 */}
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.24.30%20AM.png?alt=media&token=d64b4cc3-fe2b-4e43-a50a-7f5b555755c8" 
                  alt="Project 1" 
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
