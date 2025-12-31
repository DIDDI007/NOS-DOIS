
import React, { useState } from 'react';
import { FavoriteMessage } from '../types';

interface Props {
  favorites: FavoriteMessage[];
  onRemoveFavorite: (id: string) => void;
  onBack: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const FavoritesSection: React.FC<Props> = ({ favorites, onRemoveFavorite, onBack }) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleOpenConfirm = (id: string) => {
    setConfirmingId(id);
  };

  const executeRemove = () => {
    if (confirmingId) {
      onRemoveFavorite(confirmingId);
      setConfirmingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all" title="Início">
          <HomeIcon />
        </button>
        <h2 className="serif text-xl text-gray-500/80">Favoritos</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-24">
        {favorites.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-4xl mb-4">⭐</span>
            <p className="text-sm italic">Sua coleção está vazia.<br/>Guarde mensagens que te tocam.</p>
          </div>
        ) : (
          favorites.map(fav => (
            <div key={fav.id} className="bg-white/50 backdrop-blur-md p-7 rounded-[2rem] border border-white/40 shadow-sm relative group animate-in fade-in zoom-in duration-300">
              <div className="absolute -top-3 -left-2 text-2xl drop-shadow-sm">⭐</div>
              <p className="serif italic text-lg leading-relaxed text-gray-700 mb-6">"{fav.text}"</p>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-widest text-gray-400">{new Date(fav.timestamp).toLocaleDateString('pt-BR')}</span>
                  {fav.emotion && (
                    <span className="text-[8px] uppercase tracking-tighter text-[#D4A5A5] font-bold">Sentimento: {fav.emotion}</span>
                  )}
                </div>
                <button 
                  onClick={() => handleOpenConfirm(fav.id)}
                  className="px-4 py-2 bg-red-50 text-red-400 text-[10px] uppercase tracking-widest font-bold rounded-full active:scale-90 transition-transform"
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmingId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-xs w-full shadow-2xl text-center">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="serif text-lg mb-2 italic">Remover favorito?</h3>
            <p className="text-xs text-gray-500 mb-8 font-light leading-relaxed">
              Esta mensagem sairá da sua coleção de favoritos, mas você ainda pode encontrá-la se escrever novamente.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={executeRemove}
                className="w-full py-4 bg-red-500 text-white rounded-2xl text-xs font-bold tracking-widest uppercase active:scale-95 transition-transform"
              >
                Sim, remover
              </button>
              <button 
                onClick={() => setConfirmingId(null)}
                className="w-full py-4 text-gray-400 text-xs tracking-widest uppercase active:scale-95"
              >
                Manter guardada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
