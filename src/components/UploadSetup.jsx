import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import exifr from 'exifr';
import { Camera, Calendar, Heart, ArrowRight, Wand2, Edit2, Check, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

const AI_CAPTIONS = [
  "Um sorriso que mudou meus dias.",
  "Uma lembrança que nunca perdeu a importância.",
  "Entre tantos momentos, este continua especial.",
  "O início de algo que eu não sabia que precisava tanto.",
  "Seu olhar tem a cor do meu futuro.",
  "E de repente, tudo fez sentido com você.",
  "Pausaria o tempo aqui, para sempre.",
  "Meu lugar favorito no mundo é com você."
];

export default function UploadSetup({ onComplete }) {
  const [photos, setPhotos] = useState([]);
  const [startDate, setStartDate] = useState('2023-06-12');
  const [partnerName, setPartnerName] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Upload, 3: Review, 4: QR
  const [editingCaption, setEditingCaption] = useState(null);
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const newPhotos = await Promise.all(acceptedFiles.map(async (file) => {
      const url = URL.createObjectURL(file);
      let date = new Date();
      try {
        const exifData = await exifr.parse(file);
        if (exifData && exifData.DateTimeOriginal) {
          date = new Date(exifData.DateTimeOriginal);
        }
      } catch (e) {
        console.log("No EXIF data found");
      }
      
      const randomCaption = AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        url,
        file,
        date,
        caption: randomCaption
      };
    }));
    
    // Sort chronologically
    setPhotos(prev => [...prev, ...newPhotos].sort((a, b) => a.date - b.date));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const handleUpdateCaption = (id, newCaption) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, caption: newCaption } : p));
    setEditingCaption(null);
  };

  const handleUpdateDate = (id, newDateStr) => {
    const newDate = new Date(newDateStr);
    const updated = photos.map(p => p.id === id ? { ...p, date: newDate } : p).sort((a, b) => a.date - b.date);
    setPhotos(updated);
  };

  const currentUrl = window.location.href;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pt-20 pb-24 px-6 max-w-2xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="text-3xl font-serif text-white mb-2">Preparando a Surpresa</h2>
        <p className="text-textMuted text-sm font-light">
          Passo {step} de 4
        </p>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-surface'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm text-textMuted mb-2">Qual o nome do seu amor?</label>
              <div className="flex items-center bg-background rounded-xl p-3 border border-white/5 focus-within:border-primary/50 transition-colors">
                <Heart className="w-5 h-5 text-primary/50 mr-3" />
                <input 
                  type="text" 
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="Ex: Maria"
                  className="bg-transparent border-none outline-none text-white w-full"
                />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm text-textMuted mb-2">Quando a história de vocês começou?</label>
              <div className="flex items-center bg-background rounded-xl p-3 border border-white/5 focus-within:border-primary/50 transition-colors">
                <Calendar className="w-5 h-5 text-primary/50 mr-3" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!partnerName || !startDate}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-secondary"
            >
              Continuar <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`glass border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl text-white mb-2 font-serif">Adicione suas memórias</h3>
              <p className="text-textMuted text-sm max-w-xs">
                Arraste fotos ou clique aqui. Extrairemos as datas automaticamente (se disponíveis).
              </p>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map(p => (
                  <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-surface relative">
                    <img src={p.url} alt="memória" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl bg-surface text-white">Voltar</button>
              <button 
                onClick={() => setStep(3)}
                disabled={photos.length === 0}
                className="flex-1 py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Organizar Memórias <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <p className="text-sm text-textMuted mb-6 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              A IA sugeriu legendas emocionais. Edite ou aceite.
            </p>

            <div className="space-y-4">
              {photos.map(p => (
                <div key={p.id} className="glass p-4 rounded-2xl flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={p.url} alt="memória" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input 
                      type="date"
                      value={p.date.toISOString().split('T')[0]}
                      onChange={(e) => handleUpdateDate(p.id, e.target.value)}
                      className="bg-transparent text-xs text-primary mb-1 outline-none"
                    />
                    
                    {editingCaption === p.id ? (
                      <div className="flex gap-2">
                        <textarea 
                          autoFocus
                          defaultValue={p.caption}
                          onBlur={(e) => handleUpdateCaption(p.id, e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-lg p-2 text-sm text-white outline-none resize-none h-20"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-white/90 line-clamp-2 cursor-pointer group flex items-start gap-2" onClick={() => setEditingCaption(p.id)}>
                        {p.caption}
                        <Edit2 className="w-3 h-3 text-white/30 group-hover:text-primary transition-colors mt-1 shrink-0" />
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl bg-surface text-white">Voltar</button>
              <button 
                onClick={() => setStep(4)}
                className="flex-1 py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                Gerar Experiência <Wand2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 flex flex-col items-center justify-center py-12 text-center">
            
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-serif text-white mb-2">Tudo Pronto!</h3>
              <p className="text-textMuted text-sm max-w-sm mx-auto">
                A trilha sonora de vocês está criada. Salve este QR Code ou inicie a experiência agora mesmo.
              </p>
            </div>

            <div id="qr-code-wrapper" className="glass p-6 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg gap-4">
              <QRCode id="qr-code-svg" value={currentUrl} size={200} fgColor="#0B0B0F" />
              <button 
                onClick={() => {
                  const svg = document.getElementById("qr-code-svg");
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width + 40;
                    canvas.height = img.height + 40;
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 20, 20);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = "Nossa_Trilha_Sonora_QRCode.png";
                    downloadLink.href = `${pngFile}`;
                    downloadLink.click();
                  };
                  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                }}
                className="text-primary text-xs font-medium uppercase tracking-wider hover:underline"
              >
                Download PNG
              </button>
            </div>

            <button 
              onClick={() => onComplete(photos, new Date(startDate), partnerName)}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 mt-4"
            >
              Iniciar Experiência <Heart className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
