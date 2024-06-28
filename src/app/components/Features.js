// components/Features.js
import Image from 'next/image';

const Features = () => {
  return (
    <section className="my-8 h-96 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-around items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        <div className="text-center p-4 bg-gray-100 rounded-lg w-full md:w-1/3">
          <h3 className="text-xl font-bold uppercase">Vision</h3>
          <p className="mt-2">Our teachers are highly qualified and experienced.</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg w-full md:w-1/3">
          <h3 className="text-xl font-bold uppercase">Projects</h3>
          <p className="mt-2">We provide state-of-the-art facilities for our students.</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg w-full md:w-1/3">
          <h3 className="text-xl font-bold uppercase">Get Involved</h3>
          <p className="mt-2">We offer a wide range of extracurricular activities.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
