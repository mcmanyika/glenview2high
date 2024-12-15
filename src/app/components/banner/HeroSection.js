"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Background shapes animation variants
  const shapes = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.15 },
  };

  return (
    <div ref={sectionRef} className="relative h-[400px] overflow-hidden bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
      {/* Decorative Background Shapes */}
      <motion.div 
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.2 }}
        className="absolute inset-0"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            variants={shapes}
            transition={{ duration: 1.5, delay: i * 0.2 }}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `rgba(59, 130, 246, ${0.05 + i * 0.02})`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              transform: 'rotate(45deg)',
            }}
          />
        ))}
      </motion.div>

      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
        <motion.svg
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative block w-full h-[80px] transform scale-110"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </motion.svg>
      </div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center p-8 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20"
          >
            <p className="text-gray-700 dark:text-gray-200 text-xl sm:text-2xl font-light leading-relaxed">
              Divaris Makaharis High School is one of Zimbabwe reputable high schools, 
              offering comprehensive Zimsec and Cambridge Examinations. The school is a 
              cradle of academic excellence whose exit profile catches up with the signs of times.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-2 left-0 w-full overflow-hidden leading-none z-20">
        <motion.svg
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative block w-full h-[80px] transform scale-110"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,234.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </motion.svg>
      </div>
    </div>
  );
}
