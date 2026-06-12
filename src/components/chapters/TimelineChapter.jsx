import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart } from 'lucide-react';

export default function TimelineChapter({ photos }) {
  return (
    <div className="w-full h-full flex flex-col p-6 pt-16 overflow-y-auto hide-scrollbar relative">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-20 pointer-events-none text-white/50">
        <span className="font-medium">Linha do Tempo</span>
        <Heart className="w-4 h-4 text-primary fill-primary" />
      </div>

      <div className="max-w-md mx-auto w-full pb-32 mt-12 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent" />

        {photos.map((photo, index) => (
          <motion.div 
            key={photo.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative pl-12 mb-12"
          >
            {/* Timeline Node */}
            <div className="absolute left-[11px] top-4 -translate-x-[50%] w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(255,0,85,1)] z-10 border-2 border-background" />
            
            <div className="glass-card rounded-2xl p-3 flex gap-4 items-center group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface">
                <img src={photo.url} alt="Memória" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              <div className="flex-1 py-1">
                <p className="text-[10px] text-primary uppercase tracking-wider font-semibold mb-1">
                  {format(photo.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
                  {photo.caption || "Um momento especial"}
                </p>
                <Heart className="w-3 h-3 text-white/20 mt-2 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
