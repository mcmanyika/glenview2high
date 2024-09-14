import React from 'react';
import Image from 'next/image';

const teamMembers = [
  { name: 'Mr Matemayi', role: 'Headmaster', imageUrl: '/images/matemayi.png' },
  { name: 'Ms Huni', role: 'Administrator', imageUrl: '/images/huni.png' },
  { name: 'Mr Tsikayi', role: 'Sciences (HOD)', imageUrl: '/images/tsikayi.png' },
  { name: 'Mrs Nendere', role: 'Commercials (HOD)', imageUrl: '/images/nendere.png' },
  { name: 'Mrs Jonga', role: 'Arts (HOD)', imageUrl: '/images/jonga.png' },
];

const ManagementTeam = () => {
  return (
    <section id='team'>
    <div className="bg-main2 p-4">
      <div className="text-2xl md:text-4xl text-center font-thin w-full p-5">Our Management Team</div>
      <div className="w-full md:max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center p-4">
            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-2 group">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="rounded-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-main3 opacity-20 rounded-full"></div>
            </div>
            <div className="text-lg font-semibold">{member.name}</div>
            <div className="text-base font-thin text-gray-600">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default ManagementTeam;
