'use client'
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: 'Our Vision',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fclassroms.jpeg?alt=media&token=e989df51-cc5e-4306-943d-cb06d197c209',
      description: 'To be the centre of excellence in the provision of high quality education as well as to develop in the pupils, desire of quality services, courage and usefulness to the school and ready to accept responsibility in pursuance of our aspirations and cherished goals.',
    },
    {
      title: 'Our School Tone',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fprefects.jpeg?alt=media&token=59735498-0229-4a0b-8669-3410f69a407f',
      description: 'We have committees such as Disciplinary and Guidance and Counselling that work with the Prefects Body to ensure maximum discipline',
    },
    {
      title: 'In Class',
      image: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Felectronics.jpeg?alt=media&token=356cac23-0bae-4eb3-bcd8-26b1b1af9b68',
      description: 'In support of STEM in the 21st Century. `A` Level chemistry practical in progress',
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-around items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        {features.map((feature, index) => (
          <div key={index} className="text-center rounded-lg w-full p-4 md:w-1/3 relative group">
            <h3 className="text-2xl p-4">{feature.title}</h3>
            <hr /> <br/>
            <div className="relative h-64 overflow-hidden">
              <div className="h-full w-full transform transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src={feature.image}
                  alt={`${feature.title} Image`}
                  fill
                  className="opacity-95 object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
