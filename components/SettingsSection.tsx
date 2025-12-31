
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  trashCount: number;
  historyCount: number;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onClear: () => void;
  onBack: () => void;
  onOpenTrash: () => void;
  onOpenHistory: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SettingsSection: React.FC<Props> = ({ settings, trashCount, historyCount, onUpdate, onClear, onBack, onOpenTrash, onOpenHistory }) => {
  const [canInstall, setCanInstall] = useState(!!window.deferredPrompt);

  useEffect(() => {
    const handleInstallable = (e: any) => {
      setCanInstall(e.detail);
    };
    window.addEventListener('pwa-installable', handleInstallable);
    
    // Verificação secundária
    const interval = setInterval(() => {
      if (window.deferredPrompt && !canInstall) setCanInstall(true);
    }, 2000);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      clearInterval(interval);
    };
  }, [canInstall]);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`Resultado da instalação: ${outcome}`);
    
    window.deferredPrompt = null;
    setCanInstall(false);
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-6 duration-500 overflow-y-auto pb-10 pr-1 scrollbar-hide">
      <header className="flex justify-between items-center mb-10 flex-shrink-0">
        <button onClick={onBack} className="p-3 -ml-3 text-[#3D3434] dark:text-white hover:opacity-70 transition-all">
          <HomeIcon />
        </button>
        <h2 className="serif text-2xl font-black italic text-[#3D3434] dark:text-white">Ajustes</h2>
        <div className="w-10"></div>
      </header>

      <div className="space-y-10">
        {/* Bloco de Instalação PWA */}
        {canInstall && !isStandalone && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-700">
            <label className="block text-[11px] uppercase tracking-[0.3em] px-6 font-black text-[#A17A74] dark:text-[#D4A5A5]">
              Aplicativo
            </label>
            <button 
              onClick={handleInstallClick}
              className="w-full flex items-center justify-between p-6 bg-[#A17A74] text-white rounded-[2.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📲</span>
                </div>
                <div className="text-left">
                  <span className="text-sm font-black block">Instalar no Celular</span>
                  <span className="text-[9px] uppercase tracking-widest font-black opacity-80">Acesso rápido e offline</span>
                </div>
              </div>
              <span className="font-black text-xl">→</span>
            </button>
          </div>
        )}

        {isStandalone && (
          <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl">
            <p className="text-[10px] text-green-700 dark:text-green-400 font-black uppercase tracking-widest text-center">
              ✓ Aplicativo Instalado
            </p>
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-[11px] uppercase tracking-[0.3em] px-6 font-black text-[#A17A74] dark:text-[#D4A5A5]">
            Ambiente e Luz
          </label>
          
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white/20 shadow-lg transition-colors">
            <div className="flex justify-between items-center mb-8">
               <div className="flex flex-col">
                  <span className="text-sm font-black text-[#3D3434] dark:text-white">Modo Noturno</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#A17A74] font-black opacity-60">
                    {settings.nightMode ? 'Ativado' : 'Desativado'}
                  </span>
               </div>
               <button 
                  onClick={() => onUpdate({ nightMode: !settings.nightMode })}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${settings.nightMode ? 'bg-[#A17A74]' : 'bg-gray-300'}`}
               >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center text-[10px] ${settings.nightMode ? 'left-7' : 'left-1'}`}>
                    {settings.nightMode ? '🌙' : '☀️'}
                  </div>
               </button>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#3D3434] dark:text-white">Brilho</span>
                  <span className="text-[10px] font-black text-[#A17A74]">{settings.brightness}%</span>
               </div>
               <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={settings.brightness}
                  onChange={(e) => onUpdate({ brightness: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-[#A17A74] cursor-pointer"
               />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[11px] uppercase tracking-[0.3em] px-6 font-black text-[#A17A74] dark:text-[#D4A5A5]">
            Gerenciar Registros
          </label>
          
          <button 
            onClick={onOpenHistory}
            className="w-full flex items-center justify-between p-6 bg-white dark:bg-[#2D2A2A] rounded-[2.5rem] border-2 border-[#A17A74]/10 hover:border-[#A17A74] transition-all shadow-md"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#A17A74]/20 rounded-2xl flex items-center justify-center text-[#A17A74]">
                <CalendarIcon />
              </div>
              <span className="text-sm font-black text-[#3D3434] dark:text-white">Histórico Emocional</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white bg-[#A17A74] px-4 py-1.5 rounded-full">{historyCount}</span>
              <span className="text-[#A17A74] font-black text-xl">›</span>
            </div>
          </button>

          <button 
            onClick={onOpenTrash}
            className="w-full flex items-center justify-between p-6 bg-white dark:bg-[#2D2A2A] rounded-[2.5rem] border-2 border-[#A17A74]/10 hover:border-[#A17A74] transition-all shadow-md"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-gray-500/10 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🗑️</span>
              </div>
              <span className="text-sm font-black text-[#3D3434] dark:text-white">Lixeira</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white bg-gray-600 px-4 py-1.5 rounded-full">{trashCount}</span>
              <span className="text-gray-400 font-black text-xl">›</span>
            </div>
          </button>
        </div>

        <div className="pt-10">
          <button 
            onClick={onClear}
            className="w-full py-6 text-[11px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black border-2 border-red-100 dark:border-red-500/20 rounded-[2.5rem] active:scale-95 shadow-sm transition-all"
          >
            Desconectar e Apagar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
