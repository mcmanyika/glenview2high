import React from 'react';
import { FaBusinessTime, FaTheaterMasks, FaFlask, FaWrench } from 'react-icons/fa';

const curriculum = [
  { name: 'Commercials', icon: <FaBusinessTime /> },
  { name: 'Arts/Humanities', icon: <FaTheaterMasks /> },
  { name: 'Sciences', icon: <FaFlask /> },
  { name: 'Technicals', icon: <FaWrench /> },
];

const Curriculum = () => {
  return (
    <section id='academic'>
      <div className="flex flex-wrap justify-center md:space-x-16 bg-main2 p-4">
        <div className="text-4xl text-center font-thin w-full p-5">Our Curriculum</div>
        {curriculum.map((subject, index) => (
          <div key={index} className="flex flex-col items-center p-12">
            <div className="text-7xl text-red-950 mb-2 transform transition-transform duration-300 hover:scale-110">
              {subject.icon}
            </div>
            <div className="text-lg font-semibold">{subject.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Curriculum;
