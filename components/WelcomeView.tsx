
import React, { useState } from 'react';

interface Props {
  onStart: () => void;
}

const WelcomeView: React.FC<Props> = ({ onStart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[80vh] animate-in fade-in duration-1000 px-6">
      <div className="relative mb-12 flex items-center justify-center">
        {/* Efeito de brilho atrás do ícone */}
        <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-150 animate-pulse"></div>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          {!imageError ? (
            <img 
              src="icon.png" 
              alt="Ícone Nós Dois" 
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-32 h-32 rounded-full shadow-2xl border-4 border-white/60 object-cover z-10 transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            />
          ) : null}

          {/* Fallback caso a imagem demore ou falhe: Um coração elegante em CSS */}
          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
               <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse-soft border-2 border-white/60">
                  <span className="text-5xl">❤️</span>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 max-w-xs">
        <h1 className="serif text-3xl leading-relaxed italic text-[#3D3434] font-bold">
          “Ei…<br />
          se você abriu isso,<br />
          é porque sentiu saudade.<br />
          Eu tô aqui com você agora.”
        </h1>
      </div>
      
      <button 
        onClick={onStart}
        className="mt-12 group relative px-10 py-5 bg-white/30 backdrop-blur-md border-2 border-white/60 text-[#A17A74] rounded-full overflow-hidden transition-all duration-500 shadow-xl active:scale-95 hover:bg-white/50"
      >
        <span className="relative z-10 font-black tracking-[0.3em] text-[10px] uppercase">
          Entrar no Nosso Refúgio
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>

      <div className="mt-20 opacity-40">
        <p className="text-[9px] uppercase tracking-[0.6em] font-black text-[#3D3434]">Conexão Eterna</p>
      </div>
    </div>
  );
};

export default WelcomeView;
