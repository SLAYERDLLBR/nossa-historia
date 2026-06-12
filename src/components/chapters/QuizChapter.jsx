import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart } from 'lucide-react';

export default function QuizChapter({ config }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  
  const questions = config.quiz;

  const handleSelect = (idx) => {
    if (selected !== null) return; // Prevent double click
    setSelected(idx);
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
        setSelected(null);
      } else {
        setStep('done');
      }
    }, 4000); // Wait 4s showing reaction
  };

  if (step === 'done') {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <Gift className="w-24 h-24 mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-serif text-white mb-4">Você passou no teste!</h2>
          <p className="text-primary">E o prêmio é todo meu amor, para sempre.</p>
          <p className="text-textMuted text-sm mt-8">(Deslize ou toque para continuar)</p>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="w-full h-full flex flex-col justify-center p-6 relative">
      <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-white/50 text-sm font-medium">Quiz do Casal</span>
        <span className="text-white/50 text-sm">{step + 1} / {questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full max-w-md mx-auto z-20"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-10 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selected === idx;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: selected === null ? 1.02 : 1 }}
                  whileTap={{ scale: selected === null ? 0.98 : 1 }}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                    ${selected === null ? 'border-white/10 bg-surface/40 hover:bg-white/10' : 
                      isSelected ? 'border-primary bg-primary shadow-[0_0_20px_rgba(255,0,85,0.5)]' : 'border-white/5 bg-surface/20 opacity-50'}`}
                >
                  <span className={`relative z-10 font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                    {opt}
                  </span>
                  {isSelected && (
                    <motion.div layoutId="highlight" className="absolute inset-0 bg-gradient-to-r from-primary to-secondary -z-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <Heart className="w-8 h-8 mx-auto text-primary fill-primary mb-4 animate-bounce" />
                <p className="text-lg text-white whitespace-pre-wrap font-serif italic">
                  {currentQ.reaction}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
