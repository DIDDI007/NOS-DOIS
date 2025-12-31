
import React, { useState, useEffect } from 'react';

interface Props {
  targetDate: string;
  onBack: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CountdownSection: React.FC<Props> = ({ targetDate, onBack }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number} | null>(null);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      const target = new Date(`${targetDate}T00:00:00-03:00`);
      const now = new Date();
      const difference = +target - +now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft(null);
      }
      setCurrentSeconds(now.getSeconds());
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const getMessage = () => {
    if (!timeLeft) return "Hoje é o dia! ❤️ Mal posso esperar.";
    return "Contando cada segundo para estar com você.";
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-12 px-2">
        <button onClick={onBack} className="p-2 -ml-2 text-[#4A3F3F] hover:opacity-70 active:scale-90 transition-all" title="Início">
          <HomeIcon />
        </button>
        <h2 className="serif text-xl italic text-[#5D5252] font-bold">Nossa Espera</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start text-center">
        <div className="mb-12">
          <p className="serif text-3xl italic text-[#D49595] leading-snug px-8 font-medium">
            {getMessage().split('para').map((part, i) => (
              <span key={i} className="block">{part}{i === 0 ? ' para' : ''}</span>
            ))}
          </p>
        </div>

        <div className="w-full max-w-[340px] aspect-[4/5] border-2 border-white rounded-3xl bg-white/40 backdrop-blur-sm flex flex-col items-center p-8 relative shadow-lg">
          <div className="grid grid-cols-3 gap-6 w-full mb-12 mt-4">
            <TimeUnit value={timeLeft?.days || 0} label="Dias" />
            <TimeUnit value={timeLeft?.hours || 0} label="Horas" />
            <TimeUnit value={timeLeft?.minutes || 0} label="Minutos" />
          </div>

          <div className="w-24 h-20 border-2 border-[#D4A5A5]/20 flex flex-col items-center justify-center bg-white shadow-md rounded-2xl mb-12">
            <span className="text-3xl font-bold text-[#4A3F3F] tabular-nums">
              {currentSeconds.toString().padStart(2, '0')}
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4A5A5] font-black mt-1">Segundos</span>
          </div>

          <div className="mt-auto mb-4">
            <div className="w-16 h-16 rounded-full bg-[#D4A5A5]/10 flex items-center justify-center shadow-inner animate-pulse-soft">
               <span className="text-2xl">💖</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white/40 p-5 rounded-2xl border border-white/60 max-w-xs italic text-[#5D5252] text-xs font-medium leading-relaxed shadow-sm">
          "Cada segundo longe é um lembrete de quão valioso é o nosso tempo juntos."
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-4xl font-bold text-[#4A3F3F] mb-1 tabular-nums">{value}</span>
    <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A5A5] font-black">{label}</span>
  </div>
);

export default CountdownSection;
