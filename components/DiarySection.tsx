
import React, { useState } from 'react';
import { DiaryEntry } from '../types';

interface Props {
  diary: DiaryEntry[];
  onAddEntry: (entry: DiaryEntry) => void;
  onUpdateEntry: (entry: DiaryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onBack: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.006L0 24l6.149-1.613a11.78 11.78 0 005.895 1.572h.005c6.632 0 12.029-5.398 12.032-12.031a11.811 11.811 0 00-3.478-8.492"/>
  </svg>
);

const DiarySection: React.FC<Props> = ({ diary, onAddEntry, onUpdateEntry, onDeleteEntry, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingId) {
      onUpdateEntry({ id: editingId, date, content, timestamp: Date.now() });
    } else {
      onAddEntry({ id: "diary_" + Date.now(), date, content, timestamp: Date.now() });
    }
    resetForm();
  };

  const resetForm = () => {
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAdding(false);
    setEditingId(null);
    setSelectedEntry(null);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setContent(entry.content);
    setIsAdding(true);
    setSelectedEntry(null);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, entry: DiaryEntry) => {
    e.stopPropagation();
    const formattedDate = formatDateLabel(entry.date);
    const text = `✨ Registro do Diário (${formattedDate})\n\n"${entry.content}"\n\nCompartilhado do nosso Refúgio Afetivo ❤️`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center mb-10 flex-shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 hover:opacity-70 transition-all">
          <HomeIcon />
        </button>
        <h2 className="serif text-2xl font-bold text-[#2D2626]">{editingId ? 'Editando' : 'Meu Diário'}</h2>
        <button 
          onClick={() => { if(isAdding) resetForm(); else setIsAdding(true); }}
          className="w-10 h-10 bg-white border-2 border-[#D4A5A5] rounded-full shadow-sm text-lg text-[#D4A5A5] font-bold"
        >
          {isAdding ? '✕' : '＋'}
        </button>
      </header>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col animate-in fade-in duration-300">
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[0.2em] text-[#2D2626] font-black mb-3">Data do Registro</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-5 bg-white border-2 border-[#D4A5A5]/20 rounded-3xl outline-none text-[#2D2626] font-bold focus:border-[#D4A5A5] transition-all"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-xs uppercase tracking-[0.2em] text-[#2D2626] font-black mb-3">Seu coração no papel...</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sobre hoje..."
              className="flex-1 w-full p-8 bg-white border-2 border-[#D4A5A5]/10 rounded-[2.5rem] outline-none resize-none serif italic text-xl leading-relaxed text-[#2D2626] focus:border-[#D4A5A5] transition-all shadow-inner"
              autoFocus
            />
          </div>
          <div className="flex gap-4 mt-8 pb-4">
             <button 
                type="submit"
                disabled={!content.trim()}
                className="w-full py-5 bg-[#D4A5A5] text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                GUARDAR REGISTRO
              </button>
          </div>
        </form>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-24">
          {diary.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-6 opacity-40">🖋️</span>
              <p className="text-base serif italic text-[#2D2626] font-bold">O papel em branco espera por você.</p>
              <p className="text-[10px] uppercase tracking-widest text-[#D4A5A5] mt-2 font-black">Toque no + para começar</p>
            </div>
          ) : (
            diary.map(entry => (
              <div 
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white border-2 border-pink-50 p-6 rounded-[2.5rem] shadow-md active:scale-[0.98] transition-all cursor-pointer hover:border-[#D4A5A5]/30 group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white bg-[#D4A5A5] px-4 py-1.5 rounded-full font-black">
                    {formatDateLabel(entry.date)}
                  </span>
                  <button 
                    onClick={(e) => handleShareWhatsApp(e, entry)}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                    title="Enviar pelo WhatsApp"
                  >
                    <WhatsAppIcon />
                  </button>
                </div>
                <p className="text-base text-[#2D2626] font-medium italic serif line-clamp-3 leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {selectedEntry && (
        <div className="fixed inset-0 z-[150] bg-[#F0EDE9] p-8 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-md mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 border-b-2 border-white pb-6">
              <span className="text-xs uppercase tracking-[0.2em] font-black text-[#D4A5A5]">
                {formatDateLabel(selectedEntry.date)}
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => handleShareWhatsApp(e, selectedEntry)} 
                  className="p-2 text-green-600 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                  title="Compartilhar WhatsApp"
                >
                  <WhatsAppIcon />
                </button>
                <button onClick={() => setSelectedEntry(null)} className="text-[#2D2626] text-3xl font-bold">✕</button>
              </div>
            </div>
            
            <p className="flex-1 serif italic text-2xl leading-relaxed text-[#2D2626] whitespace-pre-wrap font-medium">
              {selectedEntry.content}
            </p>

            <div className="mt-12 space-y-4">
              <button 
                onClick={() => handleEdit(selectedEntry)}
                className="w-full py-5 bg-white border-2 border-[#D4A5A5] text-[#D4A5A5] rounded-3xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95"
              >
                EDITAR TEXTO
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => { onDeleteEntry(selectedEntry.id); setSelectedEntry(null); }}
                  className="flex-1 py-4 text-[10px] uppercase tracking-widest text-red-600 font-black border-2 border-red-100 rounded-2xl active:bg-red-50"
                >
                  APAGAR
                </button>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="flex-1 py-4 bg-[#2D2626] text-white rounded-2xl text-[10px] uppercase tracking-widest font-black shadow-lg"
                >
                  FECHAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiarySection;
