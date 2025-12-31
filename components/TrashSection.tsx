
import React, { useState } from 'react';
import { Photo } from '../types';

interface Props {
  trash: Photo[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onEmpty: () => void;
  onBack: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const TrashSection: React.FC<Props> = ({ trash, onRestore, onDelete, onEmpty, onBack }) => {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [confirmingEmpty, setConfirmingEmpty] = useState(false);

  const handleDeleteClick = (id: string) => {
    setConfirmingDelete(id);
  };

  const handleEmptyClick = () => {
    setConfirmingEmpty(true);
  };

  const executeDelete = () => {
    if (confirmingDelete) {
      onDelete(confirmingDelete);
      setConfirmingDelete(null);
    }
  };

  const executeEmpty = () => {
    onEmpty();
    setConfirmingEmpty(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-gray-400">← Ajustes</button>
          <div className="w-px h-3 bg-gray-200"></div>
        </div>
        <h2 className="serif text-xl text-gray-500/80">Lixeira</h2>
        {trash.length > 0 ? (
          <button 
            onClick={handleEmptyClick} 
            className="text-[10px] uppercase tracking-widest text-red-400 font-bold p-2 bg-red-50 rounded-lg active:scale-95 transition-transform"
          >
            Limpar
          </button>
        ) : <div className="w-10"></div>}
      </header>

      <div className="flex-1 overflow-y-auto pr-1 pb-20">
        {trash.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-4xl mb-4 grayscale">🗑️</span>
            <p className="text-sm italic">Sua lixeira está vazia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {trash.map(photo => (
              <div key={photo.id} className="relative aspect-square bg-white/20 rounded-2xl overflow-hidden shadow-sm">
                <img src={photo.url} alt="Deletada" className="w-full h-full object-cover opacity-60 grayscale" />
                
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/10">
                  <button 
                    onClick={() => onRestore(photo.id)}
                    className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-transform"
                    title="Restaurar"
                  >
                    🔄
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(photo.id)}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-transform"
                    title="Apagar para sempre"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[10px] text-center opacity-40 italic mt-4">
        As fotos aqui não aparecem na galeria.
      </p>

      {confirmingDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-xs w-full shadow-2xl text-center">
            <div className="text-3xl mb-4">⚠️</div>
            <h3 className="serif text-lg mb-2 italic">Tem certeza?</h3>
            <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">
              Esta memória será apagada <strong>permanentemente</strong> e não poderá ser recuperada.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={executeDelete}
                className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase active:bg-red-600 transition-colors"
              >
                Sim, apagar para sempre
              </button>
              <button 
                onClick={() => setConfirmingDelete(null)}
                className="w-full py-3 text-gray-400 text-xs tracking-widest uppercase hover:text-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingEmpty && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-xs w-full shadow-2xl text-center">
            <div className="text-3xl mb-4">🗑️✨</div>
            <h3 className="serif text-lg mb-2 italic">Limpar tudo?</h3>
            <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">
              Todas as {trash.length} fotos na lixeira serão excluídas definitivamente.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={executeEmpty}
                className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase active:bg-red-600 transition-colors"
              >
                Esvaziar Lixeira
              </button>
              <button 
                onClick={() => setConfirmingEmpty(false)}
                className="w-full py-3 text-gray-400 text-xs tracking-widest uppercase hover:text-gray-600"
              >
                Manter fotos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashSection;
