
import React, { useState, useEffect, useRef } from 'react';
import { EmotionContent } from '../types';
import { getAISupportMessage } from '../services/geminiService';
import BreathingExercise from './BreathingExercise';

interface Props {
  emotion: EmotionContent;
  onBack: () => void;
  onNavigate: (view: any) => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ExperienceView: React.FC<Props> = ({ emotion, onBack, onNavigate }) => {
  const [message, setMessage] = useState(emotion.messages[0]);
  const [isHugged, setIsHugged] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setMessage(emotion.messages[Math.floor(Math.random() * emotion.messages.length)]);
    setAiMessage(null);
  }, [emotion]);

  const rotateMessage = () => {
    const others = emotion.messages.filter(m => m !== message);
    setMessage(others[Math.floor(Math.random() * others.length)]);
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setIsHugged(true);
      setTimeout(() => setIsHugged(false), 2000);
    }
    lastTapRef.current = now;
  };

  const fetchSurprise = async () => {
    setAiMessage("Escrevendo algo especial...");
    const text = await getAISupportMessage(emotion.label);
    setAiMessage(text);
  };

  return (
    <div 
      className="flex flex-col h-full relative"
      onClick={handleDoubleTap}
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all" title="Voltar">
          <HomeIcon />
        </button>
        <span className="text-2xl">{emotion.icon}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <p className="serif text-xl italic mb-10 opacity-70">"{emotion.greeting}"</p>
        
        <div 
          onClick={rotateMessage}
          className="bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-sm cursor-pointer hover:bg-white/50 transition-all active:scale-95 min-h-[180px] flex items-center justify-center"
        >
          <p className="text-xl leading-relaxed font-light">{message}</p>
        </div>
        
        <p className="mt-4 text-[10px] uppercase tracking-widest opacity-30">Toque para trocar a mensagem</p>

        {aiMessage && (
          <div className="mt-8 animate-in zoom-in duration-500 bg-[#D4A5A5]/10 p-4 rounded-xl border border-[#D4A5A5]/20 italic text-sm">
            ✨ {aiMessage}
          </div>
        )}
      </div>

      {isHugged && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in zoom-in duration-300">
          <div className="bg-white/80 backdrop-blur-xl p-12 rounded-full shadow-2xl flex flex-col items-center gap-4">
            <span className="text-6xl animate-pulse">❤️</span>
            <p className="serif italic text-[#D4A5A5]">Abraço virtual recebido!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-auto pb-10">
        <button 
          onClick={fetchSurprise}
          className="p-4 bg-white/20 border border-white/40 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/40 transition-all flex flex-col items-center gap-2"
        >
          <span>✨</span> Botão Surpresa
        </button>
        <button 
          onClick={() => onNavigate('countdown')}
          className="p-4 bg-white/20 border border-white/40 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/40 transition-all flex flex-col items-center gap-2"
        >
          <span>⏳</span> Próximo Encontro
        </button>
        <button 
          onClick={() => onNavigate('memories')}
          className="p-4 bg-white/20 border border-white/40 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/40 transition-all flex flex-col items-center gap-2 col-span-2"
        >
          <span>💌</span> Cartas e Memórias
        </button>
      </div>

      {emotion.id === 'tired' && <BreathingExercise />}
    </div>
  );
};

export default ExperienceView;
