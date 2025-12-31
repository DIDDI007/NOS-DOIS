
import React, { useState, useEffect } from 'react';

interface Props {
  targetDate: Date;
  onBack: () => void;
}

const CountdownView: React.FC<Props> = ({ targetDate, onBack }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculate = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
       <button onClick={onBack} className="text-sm opacity-60 self-start mb-12">← Voltar</button>
       
       <div className="flex-1 flex flex-col items-center justify-center text-center">
         <h2 className="serif text-3xl mb-12 italic">Falta pouco para o nosso "oi" preferido...</h2>
         
         {timeLeft ? (
           <div className="flex gap-6">
             <div className="flex flex-col items-center">
               <span className="text-4xl font-light">{timeLeft.days}</span>
               <span className="text-[10px] uppercase tracking-widest opacity-40">Dias</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="text-4xl font-light">{timeLeft.hours}</span>
               <span className="text-[10px] uppercase tracking-widest opacity-40">Horas</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="text-4xl font-light">{timeLeft.minutes}</span>
               <span className="text-[10px] uppercase tracking-widest opacity-40">Mins</span>
             </div>
           </div>
         ) : (
           <p className="serif text-2xl italic text-[#D4A5A5]">É hoje! ❤️</p>
         )}

         <div className="mt-16 bg-white/30 backdrop-blur-md p-6 rounded-3xl max-w-xs italic text-sm leading-relaxed">
            "A distância faz ao amor o que o vento faz ao fogo: apaga o pequeno, mas inflama o grande."
         </div>
       </div>
    </div>
  );
};

export default CountdownView;
