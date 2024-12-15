"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CircleProgress({ targetValue = 0, color = "stroke-blue-500" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(targetValue);
  }, [targetValue]);

  return (
    <div className="relative h-64 w-64">
      <motion.svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        initial={{ rotate: -90 }}
        animate={{ rotate: -90 }}
      >
        {/* Background circle */}
        <circle
          className="stroke-transparent fill-none"
          cx="50"
          cy="50"
          r="44"
          strokeWidth="5"
        />
        {/* Progress circle */}
        <motion.circle
          className={`fill-none ${color}`}
          cx="50"
          cy="50"
          r="44"
          strokeWidth="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}