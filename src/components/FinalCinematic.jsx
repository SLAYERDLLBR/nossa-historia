import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function FinalCinematic({ photos, onRestart }) {
  const [phase, setPhase] = useState(0); // 0: emerging, 1: text

  // Calculate positions for a heart shape
  const heartPoints = useMemo(() => {
    // If not enough photos, let's artificially duplicate them to form a good heart outline
    const targetCount = Math.max(photos.length, 30);
    const displayPhotos = [];
    
    for (let i = 0; i < targetCount; i++) {
      displayPhotos.push(photos[i % photos.length]);
    }

    return displayPhotos.map((photo, i) => {
      const t = (i / targetCount) * Math.PI * 2;
      // Heart formula
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Scale and offset
      // Multiply by a factor depending on screen size, let's use vw/vh or just fixed max width
      const scale = 12; // Adjust size of heart
      
      return {
        ...photo,
        targetX: x * scale,
        targetY: -y * scale, // inverted Y because css
        initialX: (Math.random() - 0.5) * window.innerWidth * 1.5,
        initialY: (Math.random() - 0.5) * window.innerHeight * 1.5,
        rotation: (Math.random() - 0.5) * 60,
        delay: i * 0.1
      };
    });
  }, [photos]);

  useEffect(() => {
    const totalTime = heartPoints.length * 100 + 2000;
    const timer = setTimeout(() => {
      setPhase(1);
    }, totalTime);
    return () => clearTimeout(timer);
  }, [heartPoints]);

  return (
    <div className="absolute inset-0 bg-background overflow-hidden flex items-center justify-center">
      
      {/* Photos forming heart */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        {heartPoints.map((item, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: item.initialX, 
              y: item.initialY, 
              opacity: 0, 
              scale: 0,
              rotate: item.rotation
            }}
            animate={{ 
              x: item.targetX, 
              y: item.targetY, 
              opacity: phase === 0 ? 0.8 : 0.2, // dim after text appears
              scale: 1,
              rotate: 0
            }}
            transition={{ 
              duration: 2, 
              delay: item.delay, 
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 1, delay: phase === 1 ? 0 : item.delay }
            }}
            className="absolute w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-white/20 shadow-lg"
          >
            <img src={item.url} alt="Memória" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Final Text overlay */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm -z-10" />
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 text-gradient pb-2">
              Você é minha música favorita.
            </h1>
            
            <p className="text-lg md:text-xl text-textMuted max-w-lg mb-12 font-light">
              E espero continuar escrevendo essa playlist com você por muitos e muitos anos.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="px-8 py-4 rounded-full bg-surface glass border border-primary/30 text-white font-medium flex items-center gap-3 hover:bg-primary/10 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> Reviver nossa história
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
