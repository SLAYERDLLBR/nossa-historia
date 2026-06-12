import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

export default function LoveLetter({ partnerName, onFinish }) {
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const fullText = `Meu amor, ${partnerName},\n\nCada foto, cada segundo desse tempo que passamos juntos, é apenas uma pequena demonstração do que sinto por você.\n\nA nossa história é a minha música favorita, e eu quero continuar escrevendo essa melodia ao seu lado todos os dias.\n\nCom todo o meu amor.`;

  useEffect(() => {
    // Basic typing effect simulator
    setIsTyping(true);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setTextIndex(current);
      if (current >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setShowNext(true), 1000);
      }
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full relative py-12"
    >
      <div className="absolute inset-0 bg-surface/20 rounded-3xl border border-white/5 backdrop-blur-xl" />
      
      <div className="relative z-10 p-8 md:p-12">
        <Heart className="w-8 h-8 text-primary mb-8" strokeWidth={1.5} />
        
        <h3 className="text-sm tracking-widest text-textMuted uppercase mb-8">Uma carta para você</h3>
        
        <div className="min-h-[200px] text-lg md:text-xl font-serif text-white/90 leading-relaxed whitespace-pre-wrap">
          {fullText.substring(0, textIndex)}
          {isTyping && (
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
            />
          )}
        </div>

        <AnimatePresence>
          {showNext && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-end"
            >
              <button 
                onClick={onFinish}
                className="group flex items-center gap-2 text-primary font-medium hover:text-white transition-colors"
              >
                Continuar <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
