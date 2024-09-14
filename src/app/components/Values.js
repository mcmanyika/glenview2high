import React from 'react';
import { FaBalanceScale, FaHandshake, FaRegHandPeace, FaBrain, FaClipboardCheck, FaHeart } from 'react-icons/fa';

const values = [
  { name: 'Integrity', icon: <FaBalanceScale /> },
  { name: 'Honesty', icon: <FaHandshake /> },
  { name: 'Respect', icon: <FaRegHandPeace /> },
  { name: 'Critical Thinking', icon: <FaBrain /> },
  { name: 'Accountability', icon: <FaClipboardCheck /> },
  { name: 'Empathy', icon: <FaHeart /> },
];

const Values = () => {
  return (
    <section id='values'>
      <div className="flex flex-wrap justify-center space-x-4 bg-main2 p-4">
        <div className='text-4xl text-center font-thin w-full p-5'>Our Values</div>
        {values.map((value, index) => (
          <div key={index} className="flex flex-col items-center p-12">
            <div className="text-7xl text-red-950 mb-2 transform transition-transform duration-300 hover:scale-110">
              {value.icon}
            </div>
            <div className="text-lg font-semibold">{value.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Values;
