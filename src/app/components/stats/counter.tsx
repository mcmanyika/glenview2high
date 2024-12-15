"use client";

import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className = "",
  prefix = "",
  suffix = "",
}: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const steps = Math.max(Math.floor(duration * 60), 30);
    const increment = (to - from) / steps;
    let currentCount = from;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      currentCount += increment;
      setCount(step === steps ? to : Math.round(currentCount));

      if (step === steps) {
        clearInterval(timer);
      }
    }, duration * 1000 / steps);

    return () => clearInterval(timer);
  }, [from, to, duration, isInView]);

  return (
    <span
      ref={ref}
      className={className}
    >
      {prefix}{typeof count === 'number' ? count.toLocaleString() : count}{suffix}
    </span>
  );
}