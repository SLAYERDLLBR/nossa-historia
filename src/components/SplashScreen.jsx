import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  // Array of particles for background
  const particles = Array.from({ length: 20 });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-background overflow-hidden z-50"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <Heart className="w-16 h-16 text-primary fill-primary/20" strokeWidth={1} />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-6xl font-serif font-bold text-gradient mb-6 tracking-wide"
        >
          Nossa Trilha Sonora
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl text-textMuted max-w-md font-light tracking-wide mb-12"
        >
          Uma pequena parte do quanto você significa para mim.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-8 py-4 rounded-full bg-surface glass border border-primary/30 text-white font-medium tracking-widest uppercase text-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,79,163,0.15)]"
        >
          Começar
        </motion.button>
      </div>
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </motion.div>
  );
}
