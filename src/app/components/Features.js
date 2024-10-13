'use client'
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_9017.jpg?alt=media&token=65e8821d-e582-4b7d-b545-97e48cb10223',
      description: '',
    },
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8969.jpg?alt=media&token=264678aa-a357-4d8e-8467-8fd6393bf3c3',
      description: '',
    },
    {
      title: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8920.jpg?alt=media&token=515ec866-d3fd-438d-8cf4-0d7eb1da6c94',
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
