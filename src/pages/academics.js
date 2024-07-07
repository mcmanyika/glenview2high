// Academics.js
import React from 'react';
import Layout from '../app/components/Layout2';
import Image from 'next/image';

const Academics = () => {
  return (
    <Layout templateText="Academics">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 mb-5 relative">
                <Image 
                  src="/images/students.png" 
                  alt="Academic 1" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our Programs</h2>
              <p className="text-xl font-thin mb-4">
                GlenView 2 High offers a diverse range of academic programs designed to meet the needs of every student. Whether its advanced placement courses, vocational training, or extracurricular activities, we provide a comprehensive education that prepares students for success.
              </p>
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Student Achievements</h2>
              <p className="text-xl font-thin mb-4">
                Our students consistently achieve excellence in academics, sports, and arts. From winning national competitions to excelling in community service, our students are well-rounded individuals who contribute positively to society.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.22.33%20AM.png?alt=media&token=016853a8-7561-4395-9efb-93286fd2a8d8" 
                  alt="Academic 2" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
