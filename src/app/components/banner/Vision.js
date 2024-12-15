import React, { useRef, useState } from 'react';
import { motion, useInView } from "framer-motion";
import { Users, GraduationCap } from "lucide-react";
import { Card } from "../ui/card";
import { Modal } from "../banner/Modal";

export default function Vision() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 to-white/80 dark:from-slate-900/50 dark:to-slate-800/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProgramCard
            title="Our Vision"
            description="We strive to be a center of educational excellence, recognized nationally and internationally. Our comprehensive approach encompasses academic achievement, athletic excellence, and rich cultural development, preparing students for global leadership."
            delay={0.2}
            icon={<Users className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
          />
          <ProgramCard
            title="Our Mission"
            description="We cultivate well-rounded individuals through holistic education that balances academic excellence with character development. Our innovative learning environment nurtures critical thinking, creativity, and adaptability, ensuring our students are prepared for future challenges."
            delay={0.4}
            icon={<GraduationCap className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
          />
        </div>
      </div>
    </motion.section>
  );
}

function ProgramCard({ title, description, delay, icon }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalContent = {
    Vision: {
      title: "Our Vision",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We strive to be a center of educational excellence, recognized nationally and internationally.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Academic Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">Fostering intellectual growth through innovative education</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Global Leadership</h3>
              <p className="text-gray-600 dark:text-gray-300">Preparing students for worldwide opportunities</p>
            </div>
          </div>
        </div>
      ),
    },
    Mission: {
      title: "Our Mission",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We cultivate well-rounded individuals through holistic education.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Character Development</h3>
              <p className="text-gray-600 dark:text-gray-300">Building strong moral and ethical foundations</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">Nurturing creativity and adaptability</p>
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 1,
          ease: "easeOut",
          delay: delay
        }}
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.3 }
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Card className="relative overflow-hidden p-8 text-xl font-thin leading-relaxed hover:shadow-xl transition-all duration-300 cursor-pointer group border-none bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700/50 backdrop-blur-sm">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 rounded-full transform -translate-x-12 translate-y-12" />
          
          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-2xl text-center uppercase font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              {title}
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3">{description}</p>
            
            {/* Read More Button */}
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent[title.split(" ")[1]]?.title}
      >
        {modalContent[title.split(" ")[1]]?.content}
      </Modal>
    </>
  );
}