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
              <div className="w-full h-96  relative">
                <Image 
                  src="/images/fountain.png" 
                  alt="Fountain" 
                  fill
                  className="opacity-95 object-cover object-top"
                />
              </div>
            </div>
            {/* Our History */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our History</h2>
              <p className="text-xl font-thin mb-4">
              Glen View 2 Secondary School was opened on 01 January, 1984 in the high density residential suburb of Glen View. The school offers learning up to ‘A’ Level and wide range of sporting activities. The school has 90 qualified teachers and 17 student teachers from different Colleges and Universities.
              </p>
            </div>
            {/* Our Vision */}
            <div className="md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
              <p className="text-xl font-thin mb-4">
              To be the centre of excellence in the provision of high quality education as well as to develop in the pupils, desire of quality services, courage and usefulness to the school and ready to accept responsibility in pursuance of our aspirations and cherished goals.
              </p>
            </div>
            {/* Image 2 */}
            <div className="relative flex items-center justify-center">
              <div className="w-full h-96 relative">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.24.30%20AM.png?alt=media&token=d64b4cc3-fe2b-4e43-a50a-7f5b555755c8" 
                  alt="Project 1" 
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
}
