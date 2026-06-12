import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function IntroChapter({ onNext }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,85,0.15)_0%,transparent_70%)] pointer-events-none"
      />
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="text-center z-10"
      >
        <Heart className="w-16 h-16 mx-auto mb-8 text-primary animate-pulse-glow" fill="currentColor" />
        
        <h2 className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-semibold">
          Nossa Retrospectiva
        </h2>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
          Prontos para <br/>
          <span className="text-gradient">relembrar?</span>
        </h1>
        
        <p className="text-lg text-textMuted max-w-md mx-auto font-light">
          Uma jornada pelas memórias que construímos, pelas músicas que ouvimos e pelo amor que compartilhamos.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={onNext}
        className="absolute bottom-12 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/50 transition-all backdrop-blur-md z-20"
      >
        Toque para começar a jornada
      </motion.button>
    </div>
  );
}
