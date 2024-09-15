'use client';
import React from 'react';

const Vision = () => {
  return (
    <section className="container mx-auto bg-white py-12">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="mt-1">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m0-4h.01M17 16v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h3l3 3m0-3l3-3m0 0H9" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Academic Excellence</p>
              </dt>
              <dd className="mt-2 ml-16  text-gray-500 font-sans text-xl font-thin">
                We strive to provide a rigorous academic curriculum that challenges students to achieve their best.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8h3a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v9a2 2 0 002 2h3v5l3-3z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Innovative Learning</p>
              </dt>
              <dd className="mt-2 ml-16 font-sans text-xl font-thin text-gray-500">
                Embracing modern teaching methods and technology to enhance the learning experience.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Holistic Development</p>
              </dt>
              <dd className="mt-2 ml-16 font-sans text-xl font-thin text-gray-500">
                Fostering growth in all aspects of student life, including arts, sports, and social skills.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Vision;
