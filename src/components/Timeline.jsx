import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Timeline({ photos }) {
  return (
    <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-24">
      {photos.map((photo, index) => (
        <motion.div 
          key={photo.id}
          initial={{ opacity: 0, x: -20, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative pl-8 md:pl-12"
        >
          {/* Timeline Node */}
          <div className="absolute left-0 top-0 -translate-x-[5px] w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,79,163,0.8)]" />
          
          <div className="text-xs text-primary font-medium tracking-widest mb-3 uppercase">
            {format(photo.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          
          <div className="glass rounded-2xl overflow-hidden p-2 group">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={photo.url} 
                alt="Memória" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {photo.caption && (
              <p className="px-2 pb-3 text-sm text-white/90 font-light leading-relaxed italic">
                "{photo.caption}"
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
