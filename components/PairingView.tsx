
import React, { useState } from 'react';

interface Props {
  onConnect: (code: string) => void;
}

const PairingView: React.FC<Props> = ({ onConnect }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toLowerCase();
    if (cleanCode.length < 4) {
      alert("O código precisa ter pelo menos 4 letras.");
      return;
    }
    onConnect(cleanCode);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in duration-1000 p-6">
      <div className="mb-6 text-5xl animate-bounce-slow">🔐</div>
      <h2 className="serif text-3xl mb-4 italic text-[#4A3F3F]">Conectar Nosso Refúgio</h2>
      
      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/80 mb-8 max-w-xs shadow-md">
        <p className="text-sm font-medium leading-relaxed text-[#5D5252]">
          O código é como uma <strong>chave secreta</strong>. <br/>
          Quem tiver esse código verá as mesmas fotos e mensagens que você.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: nossoamor2024"
            className="w-full p-5 bg-white border-2 border-[#D4A5A5]/20 rounded-3xl text-center serif text-xl outline-none focus:border-[#D4A5A5] transition-all shadow-inner text-[#4A3F3F]"
            maxLength={20}
          />
        </div>
        
        <button 
          type="submit"
          className="w-full py-5 bg-[#D4A5A5] text-white rounded-3xl text-sm font-bold uppercase tracking-widest shadow-lg active:scale-95 hover:bg-[#c49595] transition-all"
        >
          CONECTAR OS CELULARES
        </button>
      </form>
      
      <p className="mt-12 text-[10px] uppercase tracking-[0.2em] text-[#4A3F3F] font-bold px-10 leading-loose opacity-60">
        Certifique-se de que seu parceiro(a) digite <br/> 
        <span className="underline">exatamente as mesmas letras</span>.
      </p>
    </div>
  );
};

export default PairingView;
