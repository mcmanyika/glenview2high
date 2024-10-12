'use client'
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fclassroms.jpeg?alt=media&token=e989df51-cc5e-4306-943d-cb06d197c209',
      description: '',
    },
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8767.jpg?alt=media&token=40d44520-da11-4385-8ebb-403aae2562a0',
      description: '',
    },
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8846.jpg?alt=media&token=bde76c85-9eb2-48b2-8e03-e1ac1e8852bd',
      description: '',
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-around items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        {features.map((feature, index) => (
          <div key={index} className="pt-10 text-center rounded-lg w-full p-4 md:w-1/3 relative group">
            <div className="relative h-52 overflow-hidden">
              <div className="h-full w-full transform transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src={feature.image}
                  alt={`${feature.title} Image`}
                  fill
                  className="opacity-95 object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white p-4 text-center">
                  <p>{feature.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))} 
      </div>
    </section>
  );
};

export default Features;
