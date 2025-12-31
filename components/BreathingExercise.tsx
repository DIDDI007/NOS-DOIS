
import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => {
        if (t === 1) {
          if (phase === 'inspire') { setPhase('hold'); return 4; }
          if (phase === 'hold') { setPhase('expire'); return 4; }
          if (phase === 'expire') { setPhase('inspire'); return 4; }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const getLabel = () => {
    switch(phase) {
      case 'inspire': return 'Inspire...';
      case 'hold': return 'Segure...';
      case 'expire': return 'Expire...';
    }
  };

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
      <div className={`w-32 h-32 rounded-full border-2 border-[#D4A5A5]/30 flex items-center justify-center transition-all duration-[4000ms] ${phase === 'inspire' ? 'scale-150' : phase === 'expire' ? 'scale-90' : 'scale-125'}`}>
        <div className="text-[10px] uppercase tracking-tighter opacity-40">{timer}s</div>
      </div>
      <p className="mt-4 text-xs font-light tracking-[0.2em] opacity-60 animate-pulse">{getLabel()}</p>
    </div>
  );
};

export default BreathingExercise;
