"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function Headmaster() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax transforms
  const topLeftY = useTransform(scrollYProgress, [0, 1], [-100, 200]);
  const topLeftRotate = useTransform(scrollYProgress, [0, 1], [-45, -30]);
  const bottomRightY = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const bottomRightRotate = useTransform(scrollYProgress, [0, 1], [45, 60]);
  const centerY = useTransform(scrollYProgress, [0, 1], [-50, 100]);
  const centerRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      {/* Animated Background Bars */}
      <motion.div 
        style={{ y: topLeftY, rotate: topLeftRotate }}
        className="absolute top-0 left-0 w-[200px] h-[400px] bg-gradient-to-tr from-yellow-500/40 to-yellow-300/40 blur-sm transform -translate-x-10 -translate-y-10 z-10"
      />
      
      <motion.div 
        style={{ y: bottomRightY, rotate: bottomRightRotate }}
        className="absolute bottom-0 right-0 w-[300px] h-[500px] bg-gradient-to-bl from-blue-500/40 to-blue-300/40 blur-sm transform translate-x-10 translate-y-10 z-10"
      />
      
      <motion.div 
        style={{ y: centerY, rotate: centerRotate }}
        className="absolute top-1/2 left-1/2 w-[200px] h-[500px] bg-gradient-to-r from-red-500/30 to-red-300/30 blur-sm transform -translate-x-1/2 -translate-y-1/2 z-10"
      />

      {/* Main Content */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative max-w-7xl mx-auto z-20"
      >
        <div className="grid grid-cols-1 gap-12 items-center">
         
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 p-8 rounded-2xl shadow-xl"
          >
            <Quote className="h-12 w-12 text-blue-500/50 mb-4" />
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome Note
              </h2>
              </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-lg font-thin leading-relaxed">
              Our traditional values, where a caring, supportive environment is reinforced by high standards of behaviour, allow each and every child to develop a lifelong love of learning. We believe in a balanced curriculum that introduces and develops a wide range of skill areas to ensure stability and flexibility of learning. A high emphasis is placed upon the literacy and numeracy skills that are essential for success, whilst maintaining a wide range of academic, sporting and cultural opportunities. At Divaris, our students can discover and develop talents and interests that they never knew they had.
              </p>
            </div>

            <motion.div 
              className="pt-6 border-t border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Headmaster</p>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
