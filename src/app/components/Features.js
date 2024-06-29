'use client'
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: 'Vision',
      image: '/images/classroom.png',
      description: 'To be the centre of excellence in the provision of high quality education as well as to develop in the pupils, desire of quality services, courage and usefulness to the school and ready to accept responsibility in pursuance of our aspirations and cherished goals.',
    },
    {
      title: 'Projects',
      image: '/images/students.png',
      description: 'We provide state-of-the-art facilities for our students.',
    },
    {
      title: 'Get Involved',
      image: '/images/project2.png',
      description: 'We offer a wide range of extracurricular activities.',
    },
  ];

  return (
    <section className="my-8 px-4 md:px-0 mb-10">
      <div className="flex flex-col md:flex-row justify-around items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        {features.map((feature, index) => (
          <div key={index} className="text-center rounded-lg w-full p-4 md:w-1/3 relative group">
            <h3 className="text-xl p-4 font-bold uppercase">{feature.title}</h3>
            <div className="relative h-64">
              <Image 
                src={feature.image}
                alt={`${feature.title} Image`}
                layout="fill"
                objectFit="cover"
                className="rounded opacity-95"
              />
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
