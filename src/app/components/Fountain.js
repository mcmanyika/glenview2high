import React from 'react';
import Image from 'next/image'; // Import Image component from Next.js

const Fountain = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <Image
        src="/images/fountain.png" // Adjust the path to match your image file in the public directory
        alt="Fountain Image"
        width={800}
        height={600}
      />
    </div>
  );
};

export default Fountain;
