import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MemoryCapsuleChapter({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="w-full h-full flex flex-col p-6 pt-16 relative">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-20 pointer-events-none text-white/50">
        <span className="font-medium">Nossas Memórias</span>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar mt-8 pb-32">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(index);
              }}
              className="aspect-square bg-surface rounded-2xl overflow-hidden cursor-pointer relative group glass-card"
            >
              <img src={photo.url} alt="Cápsula" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-[10px] font-semibold tracking-wide uppercase">
                  {format(photo.date, "MMM yyyy", { locale: ptBR })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
            onClick={(e) => {
              e.stopPropagation(); // so we don't trigger the chapter advance
            }}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[60]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex flex-col items-center justify-center">
              <motion.img 
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={photos[selectedIndex].url} 
                alt="Memória expandida" 
                className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(255,0,85,0.2)] mb-6 border border-white/10"
              />
              
              <div className="text-center max-w-lg px-4">
                <p className="text-primary font-semibold tracking-widest text-[10px] mb-3 uppercase">
                  {format(photos[selectedIndex].date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
                {photos[selectedIndex].caption && (
                  <p className="text-white text-lg md:text-xl font-serif italic font-light">
                    "{photos[selectedIndex].caption}"
                  </p>
                )}
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none z-50">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors pointer-events-auto backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors pointer-events-auto backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
