import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all chapters
import IntroChapter from './chapters/IntroChapter';
import MusicPlayerChapter from './chapters/MusicPlayerChapter';
import CounterChapter from './chapters/CounterChapter';
import QuizChapter from './chapters/QuizChapter';
import TimelineChapter from './chapters/TimelineChapter';
import RetrospectiveChapter from './chapters/RetrospectiveChapter';
import MemoryCapsuleChapter from './chapters/MemoryCapsuleChapter';
import LoveLetterChapter from './chapters/LoveLetterChapter';
import FinalCinematic from './chapters/FinalCinematic';
import ShareChapter from './chapters/ShareChapter';

export default function Experience({ config, photos, startDate, onFinish }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const chapters = [
    { id: 'intro', component: IntroChapter },
    { id: 'music', component: MusicPlayerChapter },
    { id: 'counter', component: CounterChapter },
    { id: 'quiz', component: QuizChapter },
    { id: 'timeline', component: TimelineChapter },
    { id: 'retro', component: RetrospectiveChapter },
    { id: 'memories', component: MemoryCapsuleChapter },
    { id: 'letter', component: LoveLetterChapter },
    { id: 'final', component: FinalCinematic },
    { id: 'share', component: ShareChapter }
  ];

  const handleNext = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Auto-play music when reaching music chapter or if user interacts
  useEffect(() => {
    if (currentChapter === 1 && !isPlaying) {
      togglePlay();
    }
  }, [currentChapter]);

  const CurrentComponent = chapters[currentChapter].component;

  // Background color transitions based on chapter
  const getBgColor = () => {
    switch(chapters[currentChapter].id) {
      case 'intro': return 'bg-background';
      case 'music': return 'bg-[#0a0211]'; // Deep purple tint
      case 'counter': return 'bg-[#1a050f]'; // Deep red tint
      case 'quiz': return 'bg-[#051114]'; // Deep blue tint
      case 'timeline': return 'bg-background';
      case 'retro': return 'bg-[#141105]'; // Deep gold tint
      case 'letter': return 'bg-[#110505]'; // Deep red tint
      case 'final': return 'bg-background';
      default: return 'bg-background';
    }
  };

  // Resolve caminhos de assets públicos para funcionar com base path (GitHub Pages)
  const resolvePublicPath = (path) => {
    if (!path || path.startsWith('data:') || path.startsWith('http') || path.startsWith('blob:')) return path;
    const base = import.meta.env.BASE_URL || '/';
    // Remove leading slash from path if base already ends with one
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  };

  return (
    <div className={`fixed inset-0 w-full h-full transition-colors duration-1000 ${getBgColor()} overflow-hidden flex flex-col`}>
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={resolvePublicPath(config.music.file)} 
        loop 
        preload="auto"
      />

      {/* Progress Indicators (Spotify Style) */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
        {chapters.map((chap, idx) => (
          <div key={chap.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: idx < currentChapter ? '100%' : '0%' }}
              animate={{ width: idx < currentChapter ? '100%' : idx === currentChapter ? '100%' : '0%' }}
              transition={{ duration: idx === currentChapter ? 10 : 0.3, ease: 'linear' }}
              onAnimationComplete={() => {
                // If we wanted auto-advance like Spotify, we'd trigger handleNext here
                // But since some slides are interactive (quiz, timeline), we wait for user.
              }}
            />
          </div>
        ))}
      </div>

      {/* Chapter Content */}
      <div className="flex-1 relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <CurrentComponent 
              config={config}
              photos={photos} 
              startDate={startDate} 
              partnerName={config.partnerName}
              onNext={handleNext}
              onPrev={handlePrev}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Overlays (invisible tap zones) */}
      {chapters[currentChapter].id !== 'quiz' && 
       chapters[currentChapter].id !== 'final' && 
       chapters[currentChapter].id !== 'timeline' && 
       chapters[currentChapter].id !== 'retro' && 
       chapters[currentChapter].id !== 'memories' && (
        <>
          <div className="absolute top-1/4 bottom-1/4 left-0 w-1/3 z-40 cursor-pointer" onClick={handlePrev} />
          <div className="absolute top-1/4 bottom-1/4 right-0 w-2/3 z-40 cursor-pointer" onClick={handleNext} />
        </>
      )}

      {/* Visible Next Button for manual advancing */}
      {chapters[currentChapter].id !== 'final' && chapters[currentChapter].id !== 'intro' && (
        <button 
          onClick={handleNext}
          className="absolute bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md border border-white/20 shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 ml-1">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
