
import React from 'react';
import { EMOTIONS } from '../constants';
import { EmotionType } from '../types';

interface Props {
  onSelect: (emotion: EmotionType) => void;
}

const EmotionPicker: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-700">
      <h2 className="serif text-2xl text-center mb-10 mt-10">Como seu coração está hoje?</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.values(EMOTIONS).map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => onSelect(emotion.id as EmotionType)}
            className="group flex items-center p-6 bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/60 transition-all duration-300 shadow-sm active:scale-95"
          >
            <span className="text-3xl mr-6 group-hover:scale-125 transition-transform duration-300">{emotion.icon}</span>
            <div className="text-left">
              <p className="font-medium text-lg">{emotion.label}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-auto text-xs text-center opacity-50 pb-8 italic">
        Sua escolha muda nossa experiência.
      </p>
    </div>
  );
};

export default EmotionPicker;
