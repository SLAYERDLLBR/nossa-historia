import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import localforage from 'localforage';
import SplashScreen from './components/SplashScreen';
import Experience from './components/Experience';
import AdminDashboard from './components/admin/AdminDashboard';
import { CONFIG as DEFAULT_CONFIG } from './config';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialStep = queryParams.get('view') === 'experience' ? 'experience' : 'splash';
  
  const [step, setStep] = useState(initialStep); // splash, admin, experience
  const [appConfig, setAppConfig] = useState(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from IndexedDB if exists
  useEffect(() => {
    localforage.getItem('appConfig').then(saved => {
      if (saved) {
        setAppConfig(saved);
      }
      setIsLoaded(true);
    }).catch(e => {
      console.error(e);
      setIsLoaded(true);
    });
  }, []);

  const handleSaveConfig = async (newConfig) => {
    setAppConfig(newConfig);
    await localforage.setItem('appConfig', newConfig);
    setStep('experience');
  };

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  const startDate = new Date(appConfig.startDate);
  const photos = appConfig.memories.map(m => ({
    ...m,
    date: new Date(m.date)
  }));
  
  return (
    <div className="min-h-screen bg-background text-textLight w-full relative font-sans">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setStep('admin')} />
        )}
        {step === 'admin' && (
          <AdminDashboard 
            key="admin" 
            initialConfig={appConfig}
            onSave={handleSaveConfig}
            onPreview={() => setStep('experience')}
          />
        )}
        {step === 'experience' && (
          <Experience 
            key="experience" 
            config={appConfig}
            photos={photos} 
            startDate={startDate}
            onFinish={() => setStep('admin')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
