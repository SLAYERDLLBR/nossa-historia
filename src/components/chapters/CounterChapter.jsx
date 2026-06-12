import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function CounterChapter({ startDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, years: 0, months: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = (totalDays % 365) % 30;
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTime({ years, months, days, hours: h, minutes: m, seconds: s, totalDays });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating background hearts */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{ y: '100vh', x: Math.random() * 100 + 'vw', scale: Math.random() * 2 + 1 }}
            animate={{ y: '-20vh', rotate: 360 }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'linear' }}
          >
            <Heart fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white font-bold mb-4">Tempo Juntos</h2>
          <p className="text-primary font-medium">Desde {startDate.toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <CounterBox value={time.years} label="Anos" />
          <CounterBox value={time.months} label="Meses" />
          <CounterBox value={time.days} label="Dias" />
          <CounterBox value={time.hours} label="Horas" />
          <CounterBox value={time.minutes} label="Minutos" />
          <CounterBox value={time.seconds} label="Segundos" highlight={true} />
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-textMuted mt-12 text-lg italic"
        >
          E cada segundo ao seu lado <br/>
          <span className="text-white">é meu lugar favorito.</span>
        </motion.p>
      </motion.div>
    </div>
  );
}

function CounterBox({ value, label, highlight }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden ${highlight ? 'border-primary/50' : 'border-white/10'}`}
    >
      {highlight && <div className="absolute inset-0 bg-primary/10 animate-pulse-glow pointer-events-none" />}
      <span className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">{value}</span>
      <span className={`text-[10px] uppercase tracking-widest font-semibold ${highlight ? 'text-primary' : 'text-textMuted'}`}>{label}</span>
    </motion.div>
  );
}
