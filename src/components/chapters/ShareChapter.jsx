import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Heart, Copy, Check, MessageCircle, Send, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ShareChapter({ config }) {
  // Usa a URL pública configurada; caso contrário, usa a URL atual do navegador
  const shareUrl = config?.siteUrl?.trim() || window.location.href;
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareText = '💕 Reviva nossa história neste app especial!';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nossa Trilha Sonora',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share or error
        if (err.name !== 'AbortError') {
          console.error('Share failed', err);
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("final-qr-code");
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
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <Heart className="w-8 h-8 text-primary fill-primary mb-5 animate-pulse-glow" />
        
        <h2 className="text-3xl font-serif text-white font-bold mb-3 text-center">
          Leve nossa história <br/> onde quiser
        </h2>
        
        <p className="text-textMuted text-center mb-6 text-sm">
          Escaneie o QR Code ou compartilhe o link para reviver cada momento.
        </p>

        {/* QR Code Card */}
        <motion.div 
          className="glass-card p-5 rounded-3xl bg-white shadow-[0_0_50px_rgba(255,0,85,0.2)] mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <QRCode id="final-qr-code" value={shareUrl} size={180} fgColor="#050505" />
          <div className="flex justify-center mt-3">
             <Heart className="w-5 h-5 text-primary fill-primary" />
          </div>
        </motion.div>

        {/* Botões principais */}
        <div className="flex gap-3 w-full mb-4">
          <button 
            onClick={handleDownloadQR} 
            className="flex-1 py-3.5 bg-surface rounded-xl border border-white/10 text-white font-medium flex justify-center items-center gap-2 hover:bg-white/5 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Baixar QR
          </button>
          
          <button 
            onClick={handleNativeShare} 
            className="flex-1 py-3.5 bg-primary rounded-xl text-white font-medium flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,0,85,0.4)] text-sm"
          >
            <Share2 className="w-4 h-4" /> Compartilhar
          </button>
        </div>

        {/* Copiar link */}
        <button 
          onClick={handleCopyLink}
          className={`w-full py-3 rounded-xl border text-sm font-medium flex justify-center items-center gap-2 transition-all mb-4
            ${copied 
              ? 'bg-green-500/15 border-green-500/30 text-green-400' 
              : 'bg-surface/50 border-white/10 text-textMuted hover:text-white hover:border-white/20'
            }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Link copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copiar link
            </>
          )}
        </button>

        {/* Compartilhamento social */}
        <div className="flex gap-3 w-full">
          {/* WhatsApp */}
          <button 
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-medium flex justify-center items-center gap-2 hover:bg-[#25D366]/25 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>

          {/* Telegram */}
          <button 
            onClick={handleShareTelegram}
            className="flex-1 py-3 rounded-xl bg-[#0088cc]/15 border border-[#0088cc]/30 text-[#0088cc] font-medium flex justify-center items-center gap-2 hover:bg-[#0088cc]/25 transition-colors text-sm"
          >
            <Send className="w-4 h-4" /> Telegram
          </button>
        </div>

        {/* URL preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 px-4 py-2.5 rounded-lg bg-surface/30 border border-white/5 w-full"
        >
          <p className="text-[10px] text-textMuted text-center uppercase tracking-wider mb-1 font-medium">Link da experiência</p>
          <p className="text-[11px] text-white/60 text-center break-all font-mono leading-relaxed">{shareUrl}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
