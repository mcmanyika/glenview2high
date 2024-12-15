"use client";

import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const galleryItems = [
  {
    title: "Innovation Lab",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    description: "Students working on cutting-edge technology projects"
  },
  {
    title: "Robotics Workshop",
    image: "https://images.unsplash.com/photo-1581092160607-ee22731c2f54?w=800&q=80",
    description: "Our state-of-the-art robotics facility"
  },
  {
    title: "Digital Arts Studio",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80",
    description: "Creative space for digital media production"
  },
  {
    title: "Science Lab",
    image: "https://images.unsplash.com/photo-1581093458791-9d42e3c2fd45?w=800&q=80",
    description: "Advanced equipment for scientific research"
  },
  {
    title: "Collaboration Space",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&q=80",
    description: "Modern spaces for group projects and discussions"
  },
  {
    title: "Sports Complex",
    image: "https://images.unsplash.com/photo-1581092918478-3d0f0c0f5973?w=800&q=80",
    description: "State-of-the-art athletic facilities"
  }
];

export function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleryItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden group cursor-pointer">
            <div className="relative h-64">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.description}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}