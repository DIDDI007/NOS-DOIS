
import React, { useState } from 'react';
import { Photo } from '../types';

interface Props {
  photos: Photo[];
  onAddPhoto: (photo: Photo) => void;
  onRemovePhoto: (photo: Photo) => void;
  onBack: () => void;
  onOpenTrash: () => void;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const GallerySection: React.FC<Props> = ({ photos, onAddPhoto, onRemovePhoto, onBack, onOpenTrash }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [confirmingTrashPhoto, setConfirmingTrashPhoto] = useState<Photo | null>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        const compressedBase64 = await compressImage(reader.result as string);
        onAddPhoto({
          id: "photo_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          url: compressedBase64,
          caption: '',
          timestamp: Date.now()
        });
      } catch (err) {
        console.error("Erro ao processar imagem:", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const initiateTrash = (e: React.MouseEvent, photo: Photo) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingTrashPhoto(photo);
  };

  const confirmTrash = () => {
    if (confirmingTrashPhoto) {
      onRemovePhoto(confirmingTrashPhoto);
      if (selectedPhoto && selectedPhoto.id === confirmingTrashPhoto.id) {
        setSelectedPhoto(null);
      }
      setConfirmingTrashPhoto(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all">
          <HomeIcon />
        </button>
        <h2 className="serif text-xl text-gray-500/80">Nossa Galeria</h2>
        <label className={`text-lg cursor-pointer p-2 bg-white/40 rounded-full shadow-sm active:scale-90 transition-transform ${uploading ? 'opacity-20 pointer-events-none' : ''}`}>
          <span className="opacity-60">➕</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      </header>

      {uploading && (
        <div className="absolute inset-0 z-[200] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-12 h-12 border-4 border-[#A17A74] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="serif italic text-[#A17A74] animate-pulse">Guardando memória...</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 pb-20 scrollbar-hide">
        {photos.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
            <span className="text-4xl mb-4 grayscale">📸</span>
            <p className="text-sm italic mb-6">Nenhuma foto ainda.</p>
            <button onClick={onOpenTrash} className="text-[10px] uppercase tracking-widest text-[#A17A74] border border-[#A17A74]/30 px-4 py-2 rounded-full font-black">Ver Lixeira</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-square bg-white/20 dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full h-full cursor-pointer overflow-hidden" onClick={() => setSelectedPhoto(photo)}>
                  <img src={photo.url} alt="Memória" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                </div>
                <button 
                  type="button"
                  onClick={(e) => initiateTrash(e, photo)}
                  className="absolute top-2 right-2 z-[60] w-9 h-9 bg-red-500/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center shadow-xl border border-white/20 active:scale-75 transition-transform"
                >
                  <span className="text-sm font-bold pointer-events-none">✕</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmingTrashPhoto && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#2D2A2A] p-8 rounded-[2.5rem] max-w-xs w-full shadow-2xl text-center border-2 border-white/10">
            <h3 className="serif text-lg mb-2 italic text-[#3D3434] dark:text-white font-bold">Mover para lixeira?</h3>
            <p className="text-[11px] text-[#A17A74] mb-8 font-black uppercase tracking-widest leading-relaxed">
              A foto sairá da galeria mas continuará na lixeira por segurança.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmTrash} className="w-full py-5 bg-red-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Mover para Lixeira</button>
              <button onClick={() => setConfirmingTrashPhoto(null)} className="w-full py-4 text-[#A17A74] text-xs font-black uppercase tracking-widest active:scale-95">Manter Foto</button>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <button className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white text-3xl" onClick={() => setSelectedPhoto(null)}>✕</button>
          <img src={selectedPhoto.url} alt="Visualização" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
          <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs">
            <button 
              type="button" 
              onClick={(e) => initiateTrash(e, selectedPhoto)}
              className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] text-xs uppercase tracking-widest font-black shadow-lg active:scale-95 transition-all"
            >
              Mover para Lixeira
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
