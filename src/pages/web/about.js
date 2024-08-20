import React from 'react';
import Layout from '../../app/components/Layout2';
import Staff from '../../app/components/Staff'

export default function AboutUs() {
  return (
    <Layout templateText="About Us">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <p className="max-w-2xl mx-auto text-center text-xl font-thin mb-8">
            We are dedicated to providing quality education and fostering a supportive learning environment for our students.
          </p>
          <Staff />
        </div>
      </section>
    </Layout>
  );
}
