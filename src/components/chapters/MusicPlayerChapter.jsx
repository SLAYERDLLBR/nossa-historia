import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Music } from 'lucide-react';

export default function MusicPlayerChapter({ config, isPlaying, togglePlay }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{ 
          background: isPlaying 
            ? 'radial-gradient(circle at center, rgba(255,0,85,0.2) 0%, transparent 60%)' 
            : 'radial-gradient(circle at center, rgba(255,0,85,0.05) 0%, transparent 40%)' 
        }}
        transition={{ duration: 1 }}
      />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 mb-4"
          >
            <Music className="w-6 h-6 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-serif text-white font-bold mb-2">A Nossa Trilha</h2>
          <p className="text-textMuted text-sm">Essa música sempre me lembra nós.</p>
        </div>

        <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.3)] mb-8 glass-card p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <motion.img 
              animate={{ scale: isPlaying ? 1.05 : 1 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
              src={config.music.cover} 
              alt="Album cover" 
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay pointer-events-none" />
            )}
          </div>
          
          {/* Decorative Vinyl Edge */}
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            className="absolute right-[-20%] top-[10%] w-[80%] h-[80%] rounded-full bg-black border-4 border-surface shadow-xl -z-10"
            style={{ backgroundImage: 'repeating-radial-gradient(#111 0, #111 2px, #000 3px, #000 4px)' }}
          />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{config.music.title}</h3>
            <p className="text-primary font-medium">{config.music.artist}</p>
          </div>
          <Heart className="w-8 h-8 text-primary fill-primary animate-pulse-glow" />
        </div>

        {/* Fake Progress */}
        <div className="mb-8">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: isPlaying ? '100%' : '30%' }}
              transition={{ duration: isPlaying ? 210 : 0, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-textMuted font-medium mt-2">
            <span>1:32</span>
            <span>3:30</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-8 relative z-20">
          <SkipBack className="w-8 h-8 text-white/50" fill="currentColor" />
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,0,85,0.4)] hover:scale-105 transition-transform cursor-pointer"
          >
            {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
          </button>
          
          <SkipForward className="w-8 h-8 text-white/50" fill="currentColor" />
        </div>
      </motion.div>
    </div>
  );
}
