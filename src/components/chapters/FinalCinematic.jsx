import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function FinalCinematic({ photos, onNext }) {
  const [phase, setPhase] = useState(0); 

  const heartPoints = useMemo(() => {
    const targetCount = Math.max(photos.length, 40);
    const displayPhotos = [];
    
    for (let i = 0; i < targetCount; i++) {
      displayPhotos.push(photos[i % photos.length]);
    }

    return displayPhotos.map((photo, i) => {
      const t = (i / targetCount) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      const scale = window.innerWidth > 768 ? 15 : 8; 
      
      return {
        ...photo,
        targetX: x * scale,
        targetY: -y * scale, 
        initialX: (Math.random() - 0.5) * window.innerWidth * 2,
        initialY: (Math.random() - 0.5) * window.innerHeight * 2,
        initialZ: Math.random() * 500 - 250,
        rotation: (Math.random() - 0.5) * 180,
        delay: i * 0.05
      };
    });
  }, [photos]);

  useEffect(() => {
    const totalTime = heartPoints.length * 50 + 3000;
    const timer = setTimeout(() => {
      setPhase(1);
    }, totalTime);
    return () => clearTimeout(timer);
  }, [heartPoints]);

  return (
    <div className="absolute inset-0 bg-[#0A0005] overflow-hidden flex items-center justify-center perspective-1000">
      
      {/* Background Deep Glow */}
      <motion.div 
        animate={{ opacity: phase === 1 ? 0.8 : 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,85,0.4)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="relative w-full h-full flex items-center justify-center pointer-events-none preserve-3d">
        {heartPoints.map((item, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: item.initialX, 
              y: item.initialY, 
              z: item.initialZ,
              opacity: 0, 
              scale: 0,
              rotate: item.rotation
            }}
            animate={{ 
              x: item.targetX, 
              y: item.targetY, 
              z: 0,
              opacity: phase === 0 ? 0.9 : 0.4, 
              scale: 1,
              rotate: 0
            }}
            transition={{ 
              duration: 3, 
              delay: item.delay, 
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 1, delay: phase === 1 ? 0 : item.delay }
            }}
            className="absolute w-10 h-10 md:w-16 md:h-16 rounded-md overflow-hidden border border-primary/30 shadow-[0_0_15px_rgba(255,0,85,0.5)] backface-hidden"
          >
            <img src={item.url} alt="Memória" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {phase === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 text-glow tracking-wide">
              Você continua sendo <br/>
              <span className="text-gradient block mt-2">minha música favorita.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-lg mb-12 font-light italic">
              E espero continuar escrevendo essa playlist com você por muitos e muitos anos.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,85,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext} // This could restart or show QR code again
              className="px-8 py-4 rounded-full bg-primary text-white font-semibold tracking-wider flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(255,0,85,0.4)]"
            >
              <RotateCcw className="w-5 h-5" /> Reviver nossa história
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
