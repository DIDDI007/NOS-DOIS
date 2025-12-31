
import React, { useState } from 'react';
import { ChatEntry } from '../types';

interface Props {
  chats: ChatEntry[];
  onDeleteChat: (id: string) => void;
  onClearChats: () => void;
  onBack: () => void;
  onResumeChat: (chat: ChatEntry) => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.006L0 24l6.149-1.613a11.78 11.78 0 005.895 1.572h.005c6.632 0 12.029-5.398 12.032-12.031a11.811 11.811 0 00-3.478-8.492"/>
  </svg>
);

const ConversationHistorySection: React.FC<Props> = ({ chats, onDeleteChat, onClearChats, onBack, onResumeChat }) => {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getShareText = (chat: ChatEntry) => {
    let text = `✨ Nossa Conversa (${formatDate(chat.timestamp)})\nSentimento: ${chat.emotion}\n\n`;
    chat.messages.forEach(msg => {
      const sender = msg.sender === 'user' ? 'Você' : 'Minha Presença';
      text += `${sender}: ${msg.text}\n\n`;
    });
    text += `Enviado do nosso Refúgio Afetivo ❤️`;
    return text;
  };

  const handleShareWhatsApp = (e: React.MouseEvent, chat: ChatEntry) => {
    e.stopPropagation();
    const text = getShareText(chat);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareGeneric = async (e: React.MouseEvent, chat: ChatEntry) => {
    e.stopPropagation();
    const text = getShareText(chat);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nossa Conversa',
          text: text,
        });
      } catch (err) {
        console.error("Erro ao compartilhar", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        alert("Não foi possível copiar o texto.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all" title="Início">
          <HomeIcon />
        </button>
        <h2 className="serif text-xl text-gray-500/80 font-bold italic">Nossas Conversas</h2>
        {chats.length > 0 ? (
          <button 
            onClick={() => setConfirmingClear(true)}
            className="text-[10px] uppercase tracking-widest text-red-400 font-black border border-red-100 px-3 py-1 rounded-full"
          >
            Limpar
          </button>
        ) : <div className="w-10"></div>}
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-24 scrollbar-hide">
        {chats.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-4xl mb-4">💬</span>
            <p className="text-sm italic font-bold">Nenhum diálogo registrado ainda.<br/>Abra seu coração na Escrita Livre.</p>
          </div>
        ) : (
          chats.map(chat => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const messageCount = chat.messages.length;
            
            return (
              <div 
                key={chat.id} 
                className="group bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 p-5 rounded-[2.5rem] shadow-sm animate-in slide-in-from-bottom-2 duration-300 active:scale-[0.98] transition-all cursor-pointer hover:bg-white/60 dark:hover:bg-white/10"
                onClick={() => onResumeChat(chat)}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full">{formatDate(chat.timestamp)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-[#D4A5A5] font-black">{chat.emotion} • {messageCount} msgs</span>
                    
                    <div className="flex gap-1 ml-1">
                      <button 
                        onClick={(e) => handleShareWhatsApp(e, chat)}
                        className="p-2 bg-green-50 dark:bg-green-500/10 rounded-full text-green-600 transition-colors"
                        title="Enviar pelo WhatsApp"
                      >
                        <WhatsAppIcon />
                      </button>
                      <button 
                        onClick={(e) => handleShareGeneric(e, chat)}
                        className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-full text-[#D4A5A5] transition-colors"
                        title="Compartilhar ou Copiar"
                      >
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 opacity-80">
                  <p className="text-xs italic text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {lastMessage?.sender === 'partner' ? '✨ ' : ' você: '}
                    {lastMessage?.text}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#A17A74]/10">
                  <span className="text-[8px] uppercase tracking-widest text-[#D4A5A5] font-black">Continuar conversa →</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="text-[8px] uppercase tracking-widest text-red-300 font-black hover:text-red-500 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2D2A2A] text-[#3D3434] dark:text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-[200] border-2 border-[#A17A74]/20">
          Copiado para compartilhar! ❤️
        </div>
      )}

      {confirmingClear && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-xs w-full shadow-2xl text-center">
            <h3 className="serif text-lg mb-2 italic">Limpar tudo?</h3>
            <p className="text-xs text-gray-500 mb-8 font-light leading-relaxed">
              Isso apagará permanentemente todo o histórico de conversas deste aplicativo.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { onClearChats(); setConfirmingClear(false); }}
                className="w-full py-4 bg-red-500 text-white rounded-2xl text-xs font-bold tracking-widest uppercase active:scale-95 transition-transform"
              >
                Limpar agora
              </button>
              <button 
                onClick={() => setConfirmingClear(false)}
                className="w-full py-4 text-gray-400 text-xs tracking-widest uppercase active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistorySection;
