
import React, { useState } from 'react';
import { INITIAL_LETTERS } from '../constants';
import { Letter, Photo } from '../types';

interface Props {
  photos: Photo[];
  onRemovePhoto: (id: string) => void;
  onBack: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const MemoriesView: React.FC<Props> = ({ photos, onRemovePhoto, onBack }) => {
  const [letters] = useState<Letter[]>(INITIAL_LETTERS);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [confirmingTrashId, setConfirmingTrashId] = useState<string | null>(null);

  const initiateTrash = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingTrashId(id);
  };

  const confirmTrash = () => {
    if (confirmingTrashId) {
      onRemovePhoto(confirmingTrashId);
      setConfirmingTrashId(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500 overflow-y-auto pb-20 px-1">
       <header className="flex justify-between items-center mb-8 flex-shrink-0">
         <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all" title="Início">
           <HomeIcon />
         </button>
         <h2 className="serif text-xl">Cartas e Memórias</h2>
         <div className="w-10"></div>
       </header>
       
       <h3 className="serif text-lg mb-6 opacity-60 italic">Nossas Cartinhas</h3>

       <div className="space-y-4 mb-12">
         {letters.map(letter => (
           <div 
             key={letter.id}
             onClick={() => letter.isUnlocked && setSelectedLetter(letter)}
             className={`p-6 rounded-2xl border transition-all ${letter.isUnlocked ? 'bg-white/50 border-white/40 cursor-pointer active:scale-95' : 'bg-gray-100/30 border-dashed border-gray-300 opacity-60'}`}
           >
             <div className="flex justify-between items-center">
                <span className="font-medium">{letter.title}</span>
                <span>{letter.isUnlocked ? '💌' : '🔒'}</span>
             </div>
             {!letter.isUnlocked && (
               <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Desbloqueia em breve</p>
             )}
           </div>
         ))}
       </div>

       <h3 className="serif text-lg mb-6 opacity-60 italic">Memórias Guardadas</h3>
       
       {photos.length === 0 ? (
         <div className="p-12 text-center bg-white/20 rounded-3xl border border-dashed border-gray-300 opacity-40">
           <p className="text-xs italic">Nenhuma foto guardada ainda.</p>
         </div>
       ) : (
         <div className="grid grid-cols-2 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-square bg-white/40 rounded-2xl overflow-hidden shadow-sm">
                <img src={photo.url} alt="Memória" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={(e) => initiateTrash(e, photo.id)}
                  className="absolute top-2 right-2 z-[70] w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-xl border-2 border-white/40 active:scale-75 transition-transform"
                >
                  ✕
                </button>
              </div>
            ))}
         </div>
       )}

       {confirmingTrashId && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white p-8 rounded-3xl max-w-xs w-full shadow-2xl text-center">
             <h3 className="serif text-lg mb-2 italic">Mover para lixeira?</h3>
             <p className="text-xs text-gray-500 mb-8 font-light leading-relaxed">
               Esta foto sairá da galeria mas continuará guardada na lixeira.
             </p>
             <div className="flex flex-col gap-3">
               <button 
                 onClick={confirmTrash}
                 className="w-full py-4 bg-red-500 text-white rounded-2xl text-xs font-bold tracking-widest uppercase active:scale-95 transition-transform"
               >
                 Confirmar
               </button>
               <button 
                 onClick={() => setConfirmingTrashId(null)}
                 className="w-full py-4 text-gray-400 text-xs tracking-widest uppercase active:scale-95"
               >
                 Voltar
               </button>
             </div>
           </div>
         </div>
       )}

       {selectedLetter && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl">
             <h3 className="serif text-xl italic mb-6 border-b pb-4 text-[#D4A5A5]">{selectedLetter.title}</h3>
             <p className="text-lg leading-relaxed font-light italic text-gray-700">
                {selectedLetter.content}
             </p>
             <button 
               onClick={() => setSelectedLetter(null)}
               className="mt-10 w-full py-3 bg-[#D4A5A5] text-white rounded-xl text-sm tracking-widest active:bg-[#c49595]"
             >
               FECHAR COM CARINHO
             </button>
           </div>
         </div>
       )}
    </div>
  );
};

export default MemoriesView;
