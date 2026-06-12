import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MemoryCapsule({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif text-white mb-8 text-center">Cápsula de Memórias</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="aspect-square bg-surface rounded-2xl overflow-hidden cursor-pointer relative group shadow-lg"
            onClick={() => setSelectedIndex(index)}
          >
            <img src={photo.url} alt="Cápsula" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-xs font-medium tracking-wide">
                {format(photo.date, "MMM yyyy", { locale: ptBR })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
          >
            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-surface/50 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex flex-col items-center justify-center">
              <motion.img 
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                src={photos[selectedIndex].url} 
                alt="Memória expandida" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl mb-6"
              />
              
              <div className="text-center max-w-lg px-4">
                <p className="text-primary font-medium tracking-widest text-sm mb-2 uppercase">
                  {format(photos[selectedIndex].date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
                {photos[selectedIndex].caption && (
                  <p className="text-white text-lg md:text-xl font-serif italic">
                    "{photos[selectedIndex].caption}"
                  </p>
                )}
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors pointer-events-auto backdrop-blur-sm -ml-4 md:ml-0"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors pointer-events-auto backdrop-blur-sm -mr-4 md:mr-0"
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
