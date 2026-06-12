import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';

export default function MusicPlayer({ isPlaying, setIsPlaying }) {
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(true);
  
  // Fake music progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8">
        <img 
          src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80" 
          alt="Album cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Animated visualizer bars if playing */}
        {isPlaying && (
          <div className="absolute bottom-6 left-6 flex items-end gap-1 h-6">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                className="w-1 bg-primary rounded-t-sm"
                animate={{ height: ['20%', '100%', '30%', '80%', '40%'] }}
                transition={{ duration: 1 + i * 0.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Nossa Música Favorita</h2>
          <p className="text-primary/80 font-medium">A Trilha Sonora de Nós Dois</p>
        </div>
        <button onClick={() => setLiked(!liked)} className="p-2">
          <Heart className={`w-7 h-7 transition-colors ${liked ? 'text-primary fill-primary' : 'text-white/50'}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-textMuted font-medium mt-2">
          <span>{Math.floor(progress / 60)}:{(Math.floor(progress % 60)).toString().padStart(2, '0')}</span>
          <span>4:32</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-4">
        <button className="text-white/50 hover:text-white transition-colors">
          <SkipBack className="w-8 h-8" fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,79,163,0.4)] hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
        </button>
        
        <button className="text-white/50 hover:text-white transition-colors">
          <SkipForward className="w-8 h-8" fill="currentColor" />
        </button>
      </div>
    </motion.div>
  );
}
