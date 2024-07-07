// Clubs.js
import React from 'react';
import Layout from '../app/components/Layout2';
import Image from 'next/image';

const Clubs = () => {
  return (
    <Layout templateText="Clubs">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 m-5 relative overflow-hidden">
              <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.26.05%20AM.png?alt=media&token=ac93ba95-d1d1-4dc4-86df-c470cacd25c9" 
                  alt="Clubs 1" 
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                />
              </div>
            </div>
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Student Clubs</h2>
              <p className="text-xl font-thin mb-4">
                GlenView 2 High offers a wide range of student clubs and organizations where students can pursue their interests, develop leadership skills, and build lasting friendships. From academic clubs to cultural and sports clubs, there is something for everyone.
              </p>
            </div>
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Extracurricular Activities</h2>
              <p className="text-xl font-thin mb-4">
                Our extracurricular activities enrich the student experience by providing opportunities for personal growth, creativity, and teamwork. Students can participate in events, competitions, community service projects, and more.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative overflow-hidden">
              <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.27.53%20AM.png?alt=media&token=c7969d99-083d-47bb-9b26-62397aac1b43" 
                  alt="Clubs 2" 
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
};

export default Clubs;
