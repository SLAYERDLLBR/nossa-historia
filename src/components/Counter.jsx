import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Counter({ startDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTime({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="w-full relative py-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/40 to-surface/0 rounded-3xl" />
      
      <div className="relative z-10 text-center">
        <h3 className="text-sm uppercase tracking-widest text-primary font-semibold mb-8">Tempo Juntos</h3>
        
        <div className="flex justify-center gap-4 md:gap-6">
          <TimeUnit value={time.days} label="Dias" />
          <span className="text-2xl text-primary/50 font-serif mt-2">:</span>
          <TimeUnit value={time.hours} label="Horas" />
          <span className="text-2xl text-primary/50 font-serif mt-2">:</span>
          <TimeUnit value={time.minutes} label="Minutos" />
          <span className="text-2xl text-primary/50 font-serif mt-2">:</span>
          <TimeUnit value={time.seconds} label="Segundos" />
        </div>
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 tabular-nums tracking-tighter">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-wider text-textMuted font-medium">
        {label}
      </div>
    </div>
  );
}
