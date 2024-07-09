'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Layout from '../app/components/Layout2';

const projectsData = [
  {
    title: "Fish Farming",
    description: "The fish farming project was an initiative by the SDC in conjunction with the Agriculture Department. The project is manned by the SDC employees and the Agriculture Department. They are 3 nursery ponds, 1 breeding pond and 1 grow out pond.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.22.47%20AM.png?alt=media&token=d88f4a56-1c5b-4224-b1b7-573af7e51b21",
  },
  {
    title: "Gardening",
    description: "The school has 2 Green-houses one that solely falls under agriculture department and the other that falls under SDC. The school specializes in the growing and production of rape, tomatoes and onions. It is quite vibrant and productive with bumper garden crops.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-08%20at%2010.19.02%20PM.png?alt=media&token=70de3e32-355b-4cb9-9f8a-155847e36f23",
  },
  {
    title: "Rabbits",
    description: " The field crops that are mostly grown are maize and beans. The field crops are used to feed road runners (chickens), dogs, vulnerable pupils and parents who donate labour to the school.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-08%20at%2010.19.23%20PM.png?alt=media&token=30c53166-9bca-44d6-8d19-1849e9fcd82a",
  },
  // Add more projects as needed
];

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // You can fetch data from an API or database here
    // For this example, we're using static data
    setProjects(projectsData);
  }, []);

  return (
    <Layout templateText="Our Projects">
      <div className="container mx-auto py-16 px-4">
        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="relative w-full h-48">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                <p className="text-xl font-thin mb-4">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
