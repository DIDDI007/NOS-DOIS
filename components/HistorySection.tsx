
import React, { useState } from 'react';
import { EmotionHistoryEntry } from '../types';

interface Props {
  history: EmotionHistoryEntry[];
  onClear: () => void;
  onDeleteEntry: (id: string) => void;
  onBack: () => void;
  onEntryClick: (entry: EmotionHistoryEntry) => void;
}

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.006L0 24l6.149-1.613a11.78 11.78 0 005.895 1.572h.005c6.632 0 12.029-5.398 12.032-12.031a11.811 11.811 0 00-3.478-8.492"/>
  </svg>
);

const HistorySection: React.FC<Props> = ({ history, onClear, onDeleteEntry, onBack, onEntryClick }) => {
  const [confirmingClear, setConfirmingClear] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Hoje às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClear = () => {
    onClear();
    setConfirmingClear(false);
  };

  const handleDeleteEntry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteEntry(id);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, entry: EmotionHistoryEntry) => {
    e.stopPropagation();
    const text = `Oi amor... passei no nosso refúgio e registrei que agora estou me sentindo: ${entry.label} ${entry.icon}\n\nTe amo! ❤️`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-[#A17A74] hover:opacity-70 transition-all">← Ajustes</button>
          <div className="w-px h-3 bg-[#A17A74]/20"></div>
        </div>
        <h2 className="serif text-xl text-[#3D3434] dark:text-white font-bold italic">Seu Sentir</h2>
        {history.length > 0 ? (
          <button onClick={() => setConfirmingClear(true)} className="text-[10px] uppercase tracking-widest text-[#A17A74] font-black border border-[#A17A74]/30 px-3 py-1 rounded-full hover:bg-[#A17A74]/10 transition-colors">Limpar Tudo</button>
        ) : <div className="w-10"></div>}
      </header>

      <div className="flex-1 overflow-y-auto pr-1 pb-20 scrollbar-hide">
        {history.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-4xl mb-4">🍃</span>
            <p className="text-sm italic font-bold">Nenhum registro ainda.<br/>Como você está agora?</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-[#A17A74]/20">
            {history.map((entry) => (
              <div 
                key={entry.id} 
                onClick={() => onEntryClick(entry)}
                className="relative flex items-center gap-6 pl-10 group cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="absolute left-0 w-10 h-10 bg-white dark:bg-[#2D2A2A] rounded-full flex items-center justify-center shadow-md border border-[#A17A74]/10 z-10 group-hover:scale-110 transition-transform">
                  <span className="text-xl">{entry.icon}</span>
                </div>
                <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm p-5 rounded-[2rem] border border-white/40 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors shadow-sm relative pr-20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-black text-[#3D3434] dark:text-white tracking-tight">{entry.label}</p>
                      <p className="text-[10px] text-[#A17A74] mt-1 uppercase tracking-widest font-bold">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button 
                      onClick={(e) => handleShareWhatsApp(e, entry)}
                      className="p-2.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-full transition-all"
                      title="Enviar sentimento pelo WhatsApp"
                    >
                      <WhatsAppIcon />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteEntry(e, entry.id)}
                      className="p-2.5 text-[#A17A74]/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                      title="Apagar este registro"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <span className="absolute bottom-2 left-5 text-[7px] text-[#A17A74] opacity-0 group-hover:opacity-40 transition-opacity font-black tracking-widest uppercase">RETOMAR →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="py-6 text-center">
        <p className="text-[9px] text-[#A17A74] font-black uppercase tracking-[0.3em] opacity-40 italic">Guardamos seus últimos 50 momentos.</p>
      </footer>

      {confirmingClear && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-xs w-full shadow-2xl text-center">
            <h3 className="serif text-lg mb-2 italic">Limpar histórico?</h3>
            <p className="text-xs text-gray-500 mb-8 font-light leading-relaxed">
              Isso apagará permanentemente todos os seus registros de sentimentos passados.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleClear}
                className="w-full py-4 bg-red-500 text-white rounded-2xl text-xs font-bold tracking-widest uppercase active:scale-95 transition-transform"
              >
                Sim, limpar tudo
              </button>
              <button 
                onClick={() => setConfirmingClear(false)}
                className="w-full py-4 text-gray-400 text-xs tracking-widest uppercase active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
