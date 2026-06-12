import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Smile, Heart, Plane, Laugh } from 'lucide-react';

const iconMap = {
  Smile: Smile,
  Heart: Heart,
  Star: Star,
  Plane: Plane,
  Laugh: Laugh,
  Trophy: Trophy,
  Sparkles: Sparkles
};

export default function RetrospectiveChapter({ config }) {
  const [awardIndex, setAwardIndex] = useState(0);

  const awards = config.awards;

  useEffect(() => {
    const timer = setInterval(() => {
      setAwardIndex((prev) => (prev + 1) % awards.length);
    }, 4000); // cycle awards
    return () => clearInterval(timer);
  }, [awards.length]);

  const currentAward = awards[awardIndex];
  const Icon = iconMap[currentAward.icon] || Trophy;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <h2 className="absolute top-12 text-sm tracking-[0.3em] uppercase text-white/50 font-semibold z-20">
        Prêmios do Ano
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={awardIndex}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-full max-w-sm flex flex-col items-center perspective-1000"
        >
          <div className="relative w-64 h-80 rounded-3xl overflow-hidden glass-card shadow-2xl p-4 flex flex-col justify-end preserve-3d">
            <img src={currentAward.photo} alt="Award" className="absolute inset-0 w-full h-full object-cover -z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent -z-10" />
            
            <div className="relative z-10 text-center pb-4">
              <Icon className={`w-12 h-12 mx-auto mb-2 ${currentAward.color} drop-shadow-lg`} fill="currentColor" />
              <h3 className="text-2xl font-serif text-white font-bold text-glow">{currentAward.title}</h3>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
