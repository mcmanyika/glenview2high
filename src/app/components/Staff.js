import React from 'react';
import Image from 'next/image';

const staffMembers = [
  {
    name: 'Owen Nhire',
    position: 'Principal',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2Fprincipal.png?alt=media&token=22d34ad3-a64c-488c-afcc-cdd2ab8bcb25',
  },
  {
    name: 'Skumbuzo Jemwa',
    position: 'Vice Principal',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2Fstaff1.jpeg?alt=media&token=dcbcee5b-c6d1-499d-a54a-bab633d5a9f8',
  },
  {
    name: 'Charles Matimba',
    position: 'Vice Principal',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2Fstaff2.jpeg?alt=media&token=2500b9f3-4252-4233-8781-4c1e0d17ef90',
  }
];

const Staff = () => {
  return (
    <section className="w-full p-10 text-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((staff, index) => (
            <div key={index} className="bg-white   overflow-hidden text-center">
              <div className="relative h-48 w-48 mx-auto mt-6">
                <div className="absolute inset-0 bg-blue2 opacity-80 rounded-full z-10"></div>
                <Image
                  src={staff.imageUrl}
                  alt={staff.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-2xl font-semibold mb-2">{staff.name}</h3>
                <p className="text-xl font-medium text-gray-600 mb-2">{staff.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Staff;
