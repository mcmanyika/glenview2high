"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, Calendar } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ProgramCard = ({ title, description, delay, icon }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-slate-800/50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-blue-100/20 dark:border-slate-700 backdrop-blur-sm"
      >
        <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{description}</p>
      </motion.div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/30 dark:bg-slate-900/50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase">About Us</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Building Tomorrow s Leaders Today</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProgramCard
            title="Our Vision"
            description="Our vision involves being a centre for educational excellence nationally, regionally and internationally, offering the best quality in the areas of academics, sports, social and cultural activities."
            delay={0.2}
            icon={<Users className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
          />
          
          <ProgramCard
            title="Our Mission"
            description="To provide a well balanced exit profile whose thoughts and mindset will catch up with time to avoid redundancy. Providing a well rounded, high quality and relevant education for learners. Providing an environment that nurtures the mind, body and soul."
            delay={0.4}
            icon={<GraduationCap className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
          />
          
          <ProgramCard
            title="Our Values"
            description="Excellence in education, integrity in character, innovation in learning, and respect for diversity. We foster a supportive environment where every student can thrive and reach their full potential."
            delay={0.6}
            icon={<Calendar className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
          />
        </div>
      </div>
    </motion.section>
  );
}
