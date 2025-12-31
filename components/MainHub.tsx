
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Photo } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  hasNotification: boolean;
  photos: Photo[];
}

const PhotoCarousel: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Implementação do algoritmo de Fisher-Yates para um embaralhamento real e justo
  const shuffledPhotos = useMemo(() => {
    if (photos.length === 0) return [];
    
    const array = [...photos];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [photos]);

  useEffect(() => {
    if (shuffledPhotos.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledPhotos.length);
    }, 6000); // 6 segundos para dar tempo de apreciar cada memória
    
    return () => clearInterval(timer);
  }, [shuffledPhotos.length]);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-white/20 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-[#A17A74]/30 flex flex-col items-center justify-center p-8 text-center mb-8 shadow-inner">
        <span className="text-4xl mb-3 opacity-30">📸</span>
        <p className="text-sm serif italic text-[#3D3434] dark:text-[#E0D7D7] font-bold">Nossa história começa aqui...</p>
        <p className="text-[9px] uppercase tracking-widest mt-2 opacity-40">Adicione fotos na Galeria</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-10 px-2">
      <div className="relative aspect-[16/10] bg-white dark:bg-[#2D2A2A] p-3 pb-16 rounded-sm shadow-2xl rotate-[-1.5deg] transition-transform hover:rotate-0 duration-1000 group">
        <div className="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative rounded-sm">
          {shuffledPhotos.map((photo, index) => (
            <img
              key={photo.id}
              src={photo.url}
              alt="Memória Aleatória"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ))}
          
          {/* Overlay suave para melhorar legibilidade de fotos muito claras */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center px-4">
           <div className="flex items-center justify-center gap-2 mb-1">
             <span className="w-1 h-1 rounded-full bg-[#A17A74] animate-pulse"></span>
             <p className="serif italic text-[10px] text-[#3D3434] dark:text-[#E0D7D7] font-black tracking-[0.2em] uppercase opacity-70">
               Memórias Aleatórias
             </p>
             <span className="w-1 h-1 rounded-full bg-[#A17A74] animate-pulse"></span>
           </div>
           <p className="text-[8px] font-bold text-[#A17A74] uppercase tracking-widest opacity-40">
             Momento {currentIndex + 1} de {shuffledPhotos.length}
           </p>
        </div>
        
        {/* Detalhe estético de fita adesiva (tape) em cima da polaroid */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 dark:bg-white/10 backdrop-blur-sm rotate-[2deg] border border-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

const MainHub: React.FC<Props> = ({ onNavigate, hasNotification, photos }) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">
      <header className="py-10 text-center flex-shrink-0">
        <h1 className="serif text-5xl mb-2 italic tracking-tighter text-[#3D3434] dark:text-white font-bold">Nós Dois</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#A17A74] dark:text-[#D4A5A5] font-black">Refúgio Afetivo</p>
      </header>

      <div className="flex-1 flex flex-col overflow-y-auto pr-1 pb-10 scrollbar-hide">
        <PhotoCarousel photos={photos} />

        <div className="grid grid-cols-1 gap-4">
          <HubButton icon="⏳" label="Contagem" description="Falta pouco para o abraço" onClick={() => onNavigate('countdown')} />
          <HubButton icon="🖋️" label="Escrita Livre" description="Desabafe e receba carinho" onClick={() => onNavigate('writing')} />
          <HubButton icon="📖" label="Meu Diário" description="Registros íntimos do dia" onClick={() => onNavigate('diary')} />
          <HubButton icon="💬" label="Nossas Conversas" description="Histórico de acolhimento" onClick={() => onNavigate('chats')} />
          <HubButton icon="🖼️" label="Galeria" description="Nossas memórias salvas" onClick={() => onNavigate('gallery')} notification={hasNotification} />
          <HubButton icon="⭐" label="Favoritos" description="Mensagens guardadas" onClick={() => onNavigate('favorites')} />
          <HubButton icon="⚙️" label="Ajustes" description="Personalize seu canto" onClick={() => onNavigate('settings')} />
        </div>
      </div>
    </div>
  );
};

const HubButton: React.FC<{ icon: string; label: string; description: string; onClick: () => void; notification?: boolean }> = ({ icon, label, description, onClick, notification }) => (
  <button 
    onClick={onClick}
    className="group relative flex items-center p-6 bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-sm hover:bg-white dark:hover:bg-white/20 transition-all active:scale-[0.98]"
  >
    <div className="w-14 h-14 flex items-center justify-center bg-[#DBCFCA]/50 dark:bg-black/30 rounded-[1.5rem] mr-6 shadow-inner group-hover:scale-110 transition-transform">
      <span className="text-3xl">{icon}</span>
    </div>
    <div className="text-left flex-1">
      <h3 className="font-black text-lg text-[#3D3434] dark:text-white tracking-tight">{label}</h3>
      <p className="text-[10px] text-[#A17A74] dark:text-[#D4A5A5] font-black uppercase tracking-[0.15em] opacity-80">{description}</p>
    </div>
    {notification && (
      <span className="absolute top-5 right-5 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg"></span>
    )}
    <span className="text-[#A17A74] dark:text-[#D4A5A5] ml-2 font-black text-xl opacity-30 group-hover:opacity-100">→</span>
  </button>
);

export default MainHub;
