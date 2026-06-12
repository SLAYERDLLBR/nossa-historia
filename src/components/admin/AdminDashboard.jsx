import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Image as ImageIcon, Trophy, Gamepad2, Music, Rocket, ChevronRight, ChevronLeft, Plus, Trash2, GripVertical, Heart, Upload, Copy, Check, MessageSquare } from 'lucide-react';
import exifr from 'exifr';

// ─── Utility: extract EXIF date from a File object ───
async function extractExifDate(file) {
  try {
    const exif = await exifr.parse(file, ['DateTimeOriginal', 'CreateDate']);
    const d = exif?.DateTimeOriginal || exif?.CreateDate;
    if (d instanceof Date) return d.toISOString().split('T')[0];
  } catch { /* no EXIF */ }
  return null;
}

// ─── Tabs ───
const TABS = [
  { id: 'dados',   label: 'Dados do Casal',   icon: Heart },
  { id: 'fotos',   label: 'Fotografias',      icon: ImageIcon },
  { id: 'retro',   label: 'Retrospectiva',    icon: Trophy },
  { id: 'quiz',    label: 'Quiz do Casal',    icon: Gamepad2 },
  { id: 'musica',  label: 'Música',           icon: Music },
  { id: 'publicar',label: 'Publicar',         icon: Rocket },
];

export default function AdminDashboard({ initialConfig, onSave }) {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('dados');
  const [saving, setSaving] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // ─── Helpers ───
  const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const setNested = (parent, idx, key, val) => {
    setConfig(prev => {
      const arr = [...prev[parent]];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...prev, [parent]: arr };
    });
  };
  const setMusic = (key, val) => setConfig(prev => ({ ...prev, music: { ...prev.music, [key]: val } }));

  // Read file as data-url
  const readFile = (file) => new Promise(resolve => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result);
    r.readAsDataURL(file);
  });

  // Photo upload with EXIF
  const handlePhotoUpload = async (files, index) => {
    for (const file of files) {
      const url = await readFile(file);
      const exifDate = await extractExifDate(file);
      if (index !== undefined) {
        setNested('memories', index, 'url', url);
        if (exifDate) setNested('memories', index, 'date', exifDate);
      } else {
        set('memories', [...config.memories, {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          date: exifDate || new Date().toISOString().split('T')[0],
          caption: '',
          url,
        }]);
      }
    }
  };

  const removeMemory = (i) => set('memories', config.memories.filter((_, j) => j !== i));
  const addQuiz = () => set('quiz', [...config.quiz, { question: '', options: ['', '', '', ''], reaction: '' }]);
  const removeQuiz = (i) => set('quiz', config.quiz.filter((_, j) => j !== i));

  const handleSave = async () => {
    setSaving(true);
    await onSave(config);
    setSaving(false);
  };

  const tabIndex = TABS.findIndex(t => t.id === activeTab);
  const goNext = () => { if (tabIndex < TABS.length - 1) setActiveTab(TABS[tabIndex + 1].id); };
  const goPrev = () => { if (tabIndex > 0) setActiveTab(TABS[tabIndex - 1].id); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full min-h-screen bg-background flex flex-col md:flex-row">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-72 bg-surface/60 border-b md:border-b-0 md:border-r border-white/5 p-5 md:p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"><Settings className="w-5 h-5 text-primary" /></div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Configuração</h1>
            <p className="text-[11px] text-textMuted">Nossa Trilha Sonora</p>
          </div>
        </div>

        {/* Progress */}
        <div className="hidden md:flex items-center gap-1 mb-6">
          {TABS.map((t, i) => (
            <div key={t.id} className={`h-1 flex-1 rounded-full transition-colors ${i <= tabIndex ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const done = i < tabIndex;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all text-sm font-medium border
                  ${active ? 'bg-primary/15 text-primary border-primary/30' : done ? 'text-white/70 border-transparent hover:bg-white/5' : 'text-white/40 border-transparent hover:bg-white/5'}`}>
                <Icon className="w-[18px] h-[18px]" />
                <span className="hidden md:inline">{tab.label}</span>
                {done && <Check className="w-4 h-4 ml-auto text-green-400 hidden md:block" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>

              {/* ════ DADOS ════ */}
              {activeTab === 'dados' && (
                <Section title="Dados do Casal" subtitle="Preencha as informações que serão usadas em toda a experiência.">
                  <Field label="Nome da pessoa homenageada">
                    <input type="text" value={config.partnerName} onChange={e => set('partnerName', e.target.value)} placeholder="Ex: Maria" className="input-field" />
                  </Field>
                  <Field label="Data de início do relacionamento">
                    <input type="date" value={config.startDate} onChange={e => set('startDate', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Carta de amor (aparece no capítulo final)">
                    <textarea value={config.loveLetter} onChange={e => set('loveLetter', e.target.value)} rows={6} placeholder="Escreva sua carta..." className="input-field resize-none" />
                  </Field>
                </Section>
              )}

              {/* ════ FOTOS ════ */}
              {activeTab === 'fotos' && (
                <Section title="Memórias & Fotografias" subtitle="Adicione fotos do casal. A data será extraída automaticamente dos metadados EXIF quando disponível.">
                  <DropZone onFiles={(files) => handlePhotoUpload(files)} />

                  <div className="space-y-3 mt-6">
                    {config.memories.map((mem, i) => (
                      <div key={mem.id} className="flex gap-3 p-3 rounded-xl bg-surface/50 border border-white/5 group relative">
                        <div className="w-24 h-24 rounded-lg bg-background border border-white/10 overflow-hidden shrink-0 relative">
                          {mem.url ? <img src={mem.url} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-6 h-6 text-white/15 absolute-center" />}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[10px] font-medium text-white">
                            Trocar
                            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handlePhotoUpload([e.target.files[0]], i)} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <input type="date" value={mem.date} onChange={e => setNested('memories', i, 'date', e.target.value)} className="input-field-sm" />
                          <input type="text" value={mem.caption} onChange={e => setNested('memories', i, 'caption', e.target.value)} placeholder="Legenda da memória..." className="input-field-sm" />
                        </div>
                        <button onClick={() => removeMemory(i)} className="absolute top-2 right-2 p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {config.memories.length === 0 && (
                      <p className="text-center py-10 text-white/20 text-sm border-2 border-dashed border-white/10 rounded-xl">Nenhuma memória adicionada.</p>
                    )}
                  </div>
                </Section>
              )}

              {/* ════ RETROSPECTIVA ════ */}
              {activeTab === 'retro' && (
                <Section title="Retrospectiva — Prêmios" subtitle="Escolha manualmente a melhor foto para cada categoria. Toque na miniatura para trocar.">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {config.awards.map((award, i) => (
                      <div key={award.id} className="p-3 rounded-xl bg-surface/50 border border-white/5 flex gap-3 items-center group">
                        <div className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-background border ${award.photo ? 'border-white/10' : 'border-primary/40 border-dashed'}`}>
                          {award.photo ? <img src={award.photo} className="w-full h-full object-cover" alt="" /> : <Plus className="w-5 h-5 text-primary absolute-center" />}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[9px] font-medium text-white">
                            Trocar
                            <input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files[0]) { const url = await readFile(e.target.files[0]); setNested('awards', i, 'photo', url); }}} />
                          </label>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{award.title}</p>
                          <p className="text-[10px] text-textMuted mt-0.5">Selecione a foto ideal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ════ QUIZ ════ */}
              {activeTab === 'quiz' && (
                <Section title="Quiz do Casal" subtitle="Crie perguntas divertidas. Todas as respostas geram uma reação personalizada.">
                  <div className="space-y-4">
                    {config.quiz.map((q, i) => (
                      <div key={i} className="p-4 rounded-xl bg-surface/50 border border-white/5 relative">
                        <button onClick={() => removeQuiz(i)} className="absolute top-3 right-3 p-1 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        <Field label="Pergunta">
                          <input type="text" value={q.question} onChange={e => setNested('quiz', i, 'question', e.target.value)} className="input-field" placeholder="Ex: Qual é a cor do meu cabelo?" />
                        </Field>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {q.options.map((opt, oi) => (
                            <input key={oi} type="text" value={opt} placeholder={`Opção ${oi + 1}`}
                              onChange={e => { const o = [...q.options]; o[oi] = e.target.value; setNested('quiz', i, 'options', o); }}
                              className="input-field-sm" />
                          ))}
                        </div>
                        <Field label="Reação (mensagem ao clicar)" className="mt-3">
                          <textarea value={q.reaction} onChange={e => setNested('quiz', i, 'reaction', e.target.value)} rows={2} className="input-field resize-none text-sm" placeholder="Boa escolha! 💖" />
                        </Field>
                      </div>
                    ))}
                  </div>
                  <button onClick={addQuiz} className="mt-4 w-full py-3 rounded-xl border border-dashed border-primary/40 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Plus className="w-4 h-4" /> Nova Pergunta
                  </button>
                </Section>
              )}

              {/* ════ MÚSICA ════ */}
              {activeTab === 'musica' && (
                <Section title="Trilha Sonora" subtitle="Defina a música que será a narradora emocional da experiência.">
                  <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-surface/50 border border-white/5">
                    <div className="w-28 h-28 rounded-xl bg-background border border-white/10 overflow-hidden relative group shrink-0 mx-auto sm:mx-0">
                      {config.music.cover ? <img src={config.music.cover} className="w-full h-full object-cover" alt="" /> : <Music className="w-7 h-7 text-white/15 absolute-center" />}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[10px] font-medium text-white text-center">Capa do<br/>Disco
                        <input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files[0]) { const url = await readFile(e.target.files[0]); setMusic('cover', url); }}} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Nome da Música"><input type="text" value={config.music.title} onChange={e => setMusic('title', e.target.value)} className="input-field-sm" /></Field>
                        <Field label="Artista"><input type="text" value={config.music.artist} onChange={e => setMusic('artist', e.target.value)} className="input-field-sm" /></Field>
                      </div>
                      <Field label="Arquivo MP3">
                        <input type="file" accept="audio/mp3,audio/mpeg" onChange={async e => { if (e.target.files[0]) { const url = await readFile(e.target.files[0]); setMusic('file', url); }}} className="input-field-sm text-textMuted file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:font-medium" />
                      </Field>
                    </div>
                  </div>
                </Section>
              )}

              {/* ════ PUBLICAR ════ */}
              {activeTab === 'publicar' && (
                <Section title="Tudo Pronto?" subtitle="Configure a URL pública, salve e visualize a experiência.">

                  {/* URL Pública */}
                  <div className="p-4 rounded-xl bg-surface/50 border border-white/5 mb-2">
                    <Field label="URL Pública do Site (para o QR Code funcionar em qualquer lugar)">
                      <input
                        type="url"
                        value={config.siteUrl || ''}
                        onChange={e => set('siteUrl', e.target.value)}
                        placeholder="https://meu-site.vercel.app"
                        className="input-field"
                      />
                    </Field>
                    <p className="text-[11px] text-textMuted mt-2">
                      Hospede o site em plataformas como <span className="text-primary font-medium">Vercel</span>, <span className="text-primary font-medium">Netlify</span> ou <span className="text-primary font-medium">GitHub Pages</span> e cole a URL aqui.
                      O QR Code usará este endereço para funcionar de qualquer dispositivo, em qualquer rede.
                    </p>
                    {config.siteUrl?.trim() ? (
                      <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        <p className="text-[11px] text-green-400 font-medium">QR Code apontará para: <span className="text-green-300 break-all">{config.siteUrl.trim()}</span></p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Rocket className="w-4 h-4 text-yellow-400 shrink-0" />
                        <p className="text-[11px] text-yellow-400 font-medium">Sem URL definida — o QR Code usará o endereço local (funciona apenas nesta rede)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center py-8 gap-6">
                    <Rocket className="w-16 h-16 text-primary" />
                    <button onClick={handleSave} disabled={saving}
                      className="w-full max-w-sm py-4 bg-primary text-white rounded-2xl font-bold flex justify-center items-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,0,85,0.3)] disabled:opacity-50">
                      {saving ? 'Salvando…' : 'Salvar & Visualizar Experiência'} <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => {
                      const a = document.createElement('a');
                      a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
                      a.download = "config_backup.json"; a.click();
                    }} className="text-sm text-textMuted hover:text-white transition-colors underline underline-offset-4">
                      Baixar backup da configuração
                    </button>
                  </div>
                </Section>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── Bottom Nav ── */}
          <div className="flex justify-between mt-10 pb-8">
            <button onClick={goPrev} disabled={tabIndex === 0} className="flex items-center gap-2 text-sm text-textMuted hover:text-white disabled:opacity-20 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            {tabIndex < TABS.length - 1 && (
              <button onClick={goNext} className="flex items-center gap-2 text-sm text-primary font-medium hover:text-white transition-colors">
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

// ─── Small reusable pieces ───

function Section({ title, subtitle, children }) {
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-textMuted mb-6">{subtitle}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[11px] text-textMuted uppercase tracking-wider mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

function DropZone({ onFiles }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  const handleDrop = (e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]); };
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${over ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'}`}>
      <Upload className="w-8 h-8 mx-auto mb-3 text-textMuted" />
      <p className="text-sm text-textMuted">Arraste suas fotos aqui ou <span className="text-primary font-medium">clique para selecionar</span></p>
      <p className="text-[11px] text-white/30 mt-2">Datas EXIF serão extraídas automaticamente</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files.length) onFiles([...e.target.files]); }} />
    </div>
  );
}
