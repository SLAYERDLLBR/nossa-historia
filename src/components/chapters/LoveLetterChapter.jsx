import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MailOpen } from 'lucide-react';

export default function LoveLetterChapter({ partnerName, config }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const fullText = config.loveLetter;

  useEffect(() => {
    if (isOpen) {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setTextIndex(current);
        if (current >= fullText.length) {
          clearInterval(interval);
        }
      }, 50); // typing speed
      return () => clearInterval(interval);
    }
  }, [isOpen, fullText.length]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div 
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer group flex flex-col items-center"
          >
            <div className="relative w-64 h-48 bg-[#a01a35] rounded-xl shadow-[0_20px_50px_rgba(255,0,85,0.4)] flex items-center justify-center border border-white/10 overflow-hidden transform transition-transform group-hover:scale-105">
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[128px] border-r-[128px] border-t-[96px] border-l-transparent border-r-transparent border-t-[#c02040] opacity-80" />
              <MailOpen className="w-12 h-12 text-white/50 z-10" />
            </div>
            <p className="mt-8 text-primary font-medium tracking-widest uppercase text-sm animate-pulse">Toque para abrir</p>
          </motion.div>
        ) : (
          <motion.div 
            key="letter"
            initial={{ y: 100, opacity: 0, rotateX: -20 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="w-full max-w-md bg-[#fdfbf7] rounded-sm shadow-2xl p-8 relative overflow-hidden perspective-1000 text-background"
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
            
            <Heart className="w-8 h-8 text-[#d02040] mb-8 mx-auto" strokeWidth={1.5} />
            
            <div className="min-h-[300px] text-lg font-serif leading-relaxed whitespace-pre-wrap text-[#4a3b3c]">
              <span className="font-bold">Meu amor, {partnerName},</span><br/><br/>
              {fullText.substring(0, textIndex)}
              {textIndex < fullText.length && (
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-5 bg-[#d02040] ml-1 align-middle"
                />
              )}
            </div>
            
            {textIndex >= fullText.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-8 text-center"
              >
                <p className="text-sm font-bold text-[#d02040] uppercase tracking-widest">
                  Com todo o meu amor.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
