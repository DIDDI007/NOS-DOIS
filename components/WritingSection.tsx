
import React, { useState, useRef, useEffect } from 'react';
import { getPartnerResponse } from '../services/geminiService';
import { FavoriteMessage, EmotionType, ChatEntry, Message } from '../types';
import { EMOTIONS } from '../constants';

interface Props {
  onBack: () => void;
  onFavorite: (fav: FavoriteMessage) => void;
  onRecordEmotion: (emotionId: EmotionType) => void;
  onRecordChat: (chat: ChatEntry) => void;
  onRecordDiary: (entry: any) => void;
  onRemoveFavorite: (id: string) => void;
  favorites: FavoriteMessage[];
  resumedChat: ChatEntry | null;
  resumedEmotion: string | null;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const WritingSection: React.FC<Props> = ({ 
  onBack, onFavorite, onRecordEmotion, onRecordChat, onRecordDiary, onRemoveFavorite, favorites, resumedChat, resumedEmotion 
}) => {
  const [step, setStep] = useState<'picking' | 'chat'>('picking');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState<{show: boolean, type: 'add' | 'remove' | 'share'}>({show: false, type: 'add'});
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Sincronização imediata se estivermos vindo de uma lista histórica
    if (resumedChat) {
      setSelectedEmotion(resumedChat.emotion);
      setMessages(resumedChat.messages);
      setCurrentChatId(resumedChat.id);
      setIsFromHistory(true);
      setStep('chat');
    } else if (resumedEmotion) {
      const emotion = EMOTIONS[resumedEmotion];
      if (emotion) {
        setSelectedEmotion(emotion.label);
        setCurrentChatId("chat_" + Date.now());
        setIsFromHistory(true);
        setStep('chat');
      }
    }
  }, [resumedChat, resumedEmotion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSelectEmotion = (emotionId: EmotionType) => {
    const emotion = EMOTIONS[emotionId];
    setSelectedEmotion(emotion.label);
    onRecordEmotion(emotionId);
    setCurrentChatId("chat_" + Date.now());
    setIsFromHistory(false); // Vindo do Hub, fluxo normal
    setStep('chat');
  };

  const handleGoBack = () => {
    if (isFromHistory) {
      // Retorna para a lista de origem (Histórico ou Conversas)
      onBack();
    } else if (step === 'chat') {
      // Se começou pelo Hub, volta para a escolha de sentimento
      setStep('picking');
    } else {
      // Já está no picking, volta para a home
      onBack();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedEmotion || loading) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    
    const chatId = currentChatId || "chat_" + Date.now();
    onRecordChat({
      id: chatId,
      messages: newMessages,
      emotion: selectedEmotion,
      timestamp: Date.now()
    });

    setLoading(true);

    try {
      const partnerResp = await getPartnerResponse(userMsg.text, selectedEmotion);
      const partnerMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: partnerResp || "Estou aqui ouvindo seu coração.",
        sender: 'partner',
        timestamp: Date.now()
      };

      const updatedMessages = [...newMessages, partnerMsg];
      setMessages(updatedMessages);
      
      onRecordChat({
        id: chatId,
        messages: updatedMessages,
        emotion: selectedEmotion,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = (text: string) => {
    const existing = favorites.find(f => f.text === text);
    if (existing) {
      onRemoveFavorite(existing.id);
      setShowSaveToast({show: true, type: 'remove'});
    } else {
      onFavorite({
        id: Date.now().toString(),
        text: text,
        timestamp: Date.now(),
        emotion: selectedEmotion || undefined
      });
      setShowSaveToast({show: true, type: 'add'});
    }
    setTimeout(() => setShowSaveToast({show: false, type: 'add'}), 3000);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
      <header className="flex justify-between items-center mb-6 flex-shrink-0">
        <button 
          onClick={handleGoBack} 
          className="p-3 -ml-2 text-[#3D3434] dark:text-[#E0D7D7] hover:opacity-70 active:scale-90 transition-all"
        >
          {step === 'chat' ? (
            <span className="text-[10px] font-black uppercase tracking-widest border border-[#A17A74]/30 px-3 py-1 rounded-full">← Voltar</span>
          ) : (
            <HomeIcon />
          )}
        </button>
        <h2 className="serif text-2xl font-bold text-[#3D3434] dark:text-[#E0D7D7]">Escrita Livre</h2>
        <div className="w-10"></div>
      </header>

      {step === 'picking' && (
        <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-300 overflow-y-auto scrollbar-hide">
          <p className="text-center serif italic text-2xl text-[#3D3434] dark:text-[#E0D7D7] mb-10 mt-6 font-bold">Como seu coração está agora?</p>
          <div className="grid grid-cols-1 gap-4 pb-12">
            {Object.values(EMOTIONS).map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleSelectEmotion(emotion.id as EmotionType)}
                className="flex items-center p-6 bg-white dark:bg-white/10 border-2 border-white/60 dark:border-white/5 rounded-[2.5rem] hover:bg-white dark:hover:bg-white/20 transition-all active:scale-[0.98] shadow-md"
              >
                <span className="text-3xl mr-6">{emotion.icon}</span>
                <span className="font-black text-[#3D3434] dark:text-[#E0D7D7] text-lg tracking-tight">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'chat' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-8 pb-10 pr-2 scroll-smooth scrollbar-hide"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in fade-in duration-1000">
                <p className="serif italic text-2xl text-[#3D3434] dark:text-[#E0D7D7] mb-4 font-bold">O espaço é seu...</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#A17A74] dark:text-[#D4A5A5] font-black leading-relaxed">Conte-me o que está passando por aí enquanto está {selectedEmotion?.toLowerCase()}</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[88%] p-6 rounded-[2.5rem] shadow-lg relative group ${
                    msg.sender === 'user' 
                    ? 'bg-[#A17A74] text-white rounded-tr-none' 
                    : 'bg-white dark:bg-[#2D2A2A] text-[#3D3434] dark:text-[#E0D7D7] rounded-tl-none border-2 border-[#A17A74]/10 dark:border-white/10'
                  }`}
                >
                  <p className={`${msg.sender === 'partner' ? 'serif italic text-lg font-medium' : 'font-bold text-base'} leading-relaxed`}>
                    {msg.text}
                  </p>
                  
                  {msg.sender === 'partner' && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#A17A74]/10 dark:border-white/10">
                      <span className="text-[9px] uppercase tracking-widest font-black text-[#A17A74] dark:text-[#D4A5A5]">Presença Afetiva</span>
                      <button 
                        onClick={() => handleToggleFav(msg.text)}
                        className={`text-xl transition-transform hover:scale-125 active:scale-90 ${favorites.some(f => f.text === msg.text) ? 'text-red-400' : 'text-gray-400'}`}
                      >
                        ★
                      </button>
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <span className="block text-[8px] uppercase tracking-[0.2em] mt-3 font-black text-white/50 text-right">Seu Coração</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-[#2D2A2A] p-6 rounded-[2rem] rounded-tl-none border-2 border-[#A17A74]/10 dark:border-white/10 flex items-center gap-3 shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#A17A74] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#A17A74] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#A17A74] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 pb-4">
            <form 
              onSubmit={handleSubmit}
              className={`relative flex items-end gap-3 ${loading ? 'opacity-50' : ''} bg-white dark:bg-[#2D2A2A] border-2 border-[#A17A74]/30 dark:border-white/20 p-2.5 rounded-[3rem] shadow-2xl focus-within:border-[#A17A74] transition-all`}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Fale com sua presença..."
                className="flex-1 bg-transparent border-none outline-none p-4 text-base font-bold text-[#3D3434] dark:text-[#E0D7D7] placeholder-[#A17A74]/50 dark:placeholder-[#E0D7D7]/30 resize-none max-h-40"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="w-14 h-14 mb-1 mr-1 bg-[#A17A74] text-white rounded-full flex items-center justify-center disabled:opacity-20 disabled:scale-95 transition-all shadow-xl active:scale-90"
              >
                <SendIcon />
              </button>
            </form>
            <p className="text-[10px] text-center mt-4 uppercase tracking-[0.4em] text-[#A17A74] dark:text-[#D4A5A5] font-black opacity-60">
              Sintonia: {selectedEmotion}
            </p>
          </div>
        </div>
      )}

      {showSaveToast.show && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2D2A2A] border-2 border-[#A17A74]/20 dark:border-white/20 px-10 py-5 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300 z-[100] flex items-center gap-4">
          <span className="text-2xl">
            {showSaveToast.type === 'add' ? '💖' : showSaveToast.type === 'share' ? '📋' : '🗑️'}
          </span>
          <span className="text-xs font-black text-[#3D3434] dark:text-[#E0D7D7] tracking-[0.2em] uppercase">
            {showSaveToast.type === 'add' ? 'Favoritado!' : showSaveToast.type === 'share' ? 'Copiado!' : 'Removido!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default WritingSection;
