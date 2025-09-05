import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer = ({ audioLevel, isActive, persona }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (isActive && audioLevel > 0) {
        const bars = 20;
        const barWidth = width / bars;
        
        for (let i = 0; i < bars; i++) {
          const barHeight = (Math.random() * audioLevel / 2 + audioLevel / 2) * height / 100;
          const x = i * barWidth;
          const y = height - barHeight;
          
          // Gradient based on persona
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, persona?.accentColor || '#8C47EE');
          gradient.addColorStop(1, persona?.accentColor + '40' || '#8C47EE40');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
      }
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (isActive) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioLevel, isActive, persona]);

  return (
    <motion.div 
      className="flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.3 }}
    >
      <canvas 
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded-lg bg-black/20"
      />
    </motion.div>
  );
};

export default AudioVisualizer;
