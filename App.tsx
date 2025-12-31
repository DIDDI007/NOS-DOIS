
import React, { useState, useEffect } from 'react';
import { AppState, AppView, EmotionType, ChatEntry, Photo } from './types';
import { EMOTIONS } from './constants';
import WelcomeView from './components/WelcomeView';
import PairingView from './components/PairingView';
import MainHub from './components/MainHub';
import CountdownSection from './components/CountdownSection';
import WritingSection from './components/WritingSection';
import GallerySection from './components/GallerySection';
import FavoritesSection from './components/FavoritesSection';
import SettingsSection from './components/SettingsSection';
import TrashSection from './components/TrashSection';
import HistorySection from './components/HistorySection';
import ConversationHistorySection from './components/ConversationHistorySection';
import DiarySection from './components/DiarySection';

import { 
  db, 
  auth, 
  signInAnonymously,
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  deleteDoc, 
  writeBatch
} from './firebase';

const LOCAL_STORAGE_KEY = 'nos_dois_v3_couple_id';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [resumedChat, setResumedChat] = useState<ChatEntry | null>(null);
  const [resumedEmotion, setResumedEmotion] = useState<string | null>(null);
  const [backView, setBackView] = useState<AppView>('hub');
  
  const [state, setState] = useState<AppState>(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 5);
    
    return {
      coupleId: localStorage.getItem(LOCAL_STORAGE_KEY) || '',
      currentView: 'hub',
      photos: [],
      trash: [],
      favorites: [],
      history: [],
      chats: [],
      diary: [],
      newPhotoNotification: false,
      settings: {
        targetDate: defaultDate.toISOString().split('T')[0],
        notificationsEnabled: true,
        nightMode: false,
        brightness: 100
      }
    };
  });

  useEffect(() => {
    if (state.settings.nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.nightMode]);

  useEffect(() => {
    if (!state.coupleId) return;

    // Conexão Segura
    const connectToFirebase = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Conectado ao Firebase com Sucesso");

        // Verifica se o casal já existe, se não, inicializa
        const coupleRef = doc(db, "couples", state.coupleId);
        const coupleSnap = await getDoc(coupleRef);
        
        if (!coupleSnap.exists()) {
          await setDoc(coupleRef, { settings: state.settings, created: Date.now() });
        }

        const listenCollection = (name: string, setter: (data: any[]) => void) => {
          const q = query(collection(db, "couples", state.coupleId, name), orderBy("timestamp", "desc"));
          return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setter(items);
          }, (err) => console.error(`Erro na coleção ${name}:`, err));
        };

        const unsubs = [
          listenCollection("diary", (data) => setState(p => ({ ...p, diary: data }))),
          listenCollection("photos", (data) => setState(p => ({ ...p, photos: data }))),
          listenCollection("chats", (data) => setState(p => ({ ...p, chats: data }))),
          listenCollection("favorites", (data) => setState(p => ({ ...p, favorites: data }))),
          listenCollection("trash", (data) => setState(p => ({ ...p, trash: data }))),
          listenCollection("history", (data) => setState(p => ({ ...p, history: data }))),
          onSnapshot(coupleRef, (doc) => {
            if (doc.exists() && doc.data().settings) {
              setState(prev => ({ ...prev, settings: { ...prev.settings, ...doc.data().settings } }));
            }
          })
        ];

        return () => unsubs.forEach(unsub => unsub());
      } catch (err) {
        console.error("Erro Crítico:", err);
      }
    };

    connectToFirebase();
  }, [state.coupleId]);

  const navigateTo = (view: AppView, origin?: AppView) => {
    if (view !== 'writing') {
      setResumedChat(null);
      setResumedEmotion(null);
    }
    if (origin) setBackView(origin);
    else if (view === 'hub') setBackView('hub');
    setState(prev => ({ ...prev, currentView: view }));
  };

  const updateSettings = (newSettings: Partial<AppState['settings']>) => {
    const updated = { ...state.settings, ...newSettings };
    setState(prev => ({ ...prev, settings: updated }));
    if (state.coupleId) {
      setDoc(doc(db, "couples", state.coupleId), { settings: updated }, { merge: true });
    }
  };

  const moveToTrash = async (photo: Photo) => {
    if (!state.coupleId) return;
    const batch = writeBatch(db);
    batch.set(doc(db, "couples", state.coupleId, "trash", photo.id), photo);
    batch.delete(doc(db, "couples", state.coupleId, "photos", photo.id));
    await batch.commit();
  };

  const restoreFromTrash = async (photoId: string) => {
    if (!state.coupleId) return;
    const photo = state.trash.find(p => p.id === photoId);
    if (!photo) return;
    const batch = writeBatch(db);
    batch.set(doc(db, "couples", state.coupleId, "photos", photo.id), photo);
    batch.delete(doc(db, "couples", state.coupleId, "trash", photo.id));
    await batch.commit();
  };

  const permanentlyDelete = async (photoId: string) => {
    if (!state.coupleId) return;
    await deleteDoc(doc(db, "couples", state.coupleId, "trash", photoId));
  };

  const emptyTrash = async () => {
    if (!state.coupleId) return;
    const batch = writeBatch(db);
    state.trash.forEach(photo => {
      batch.delete(doc(db, "couples", state.coupleId, "trash", photo.id));
    });
    await batch.commit();
  };

  if (!hasStarted) return <WelcomeView onStart={() => setHasStarted(true)} />;
  if (!state.coupleId) return <PairingView onConnect={(code) => {
    const cleanCode = code.toLowerCase().trim();
    localStorage.setItem(LOCAL_STORAGE_KEY, cleanCode);
    setState(p => ({ ...p, coupleId: cleanCode }));
  }} />;

  const safeBrightness = Math.max(20, state.settings?.brightness || 100);
  const brightnessOpacity = (100 - safeBrightness) / 100 * 0.85;

  return (
    <>
      <div className="brightness-overlay" style={{ opacity: brightnessOpacity }}></div>
      <main className="w-full max-w-md mx-auto flex flex-col p-6 overflow-x-hidden min-h-screen">
        {state.currentView === 'hub' && <MainHub onNavigate={(v) => navigateTo(v, 'hub')} hasNotification={state.newPhotoNotification} photos={state.photos} />}
        {state.currentView === 'gallery' && <GallerySection photos={state.photos} onAddPhoto={(p) => setDoc(doc(db, "couples", state.coupleId, "photos", p.id), p)} onRemovePhoto={moveToTrash} onBack={() => navigateTo('hub')} onOpenTrash={() => navigateTo('trash')} />}
        {state.currentView === 'diary' && <DiarySection diary={state.diary} onAddEntry={(e) => setDoc(doc(db, "couples", state.coupleId, "diary", e.id), e)} onUpdateEntry={(e) => setDoc(doc(db, "couples", state.coupleId, "diary", e.id), e)} onDeleteEntry={(id) => deleteDoc(doc(db, "couples", state.coupleId, "diary", id))} onBack={() => navigateTo('hub')} />}
        {state.currentView === 'countdown' && <CountdownSection targetDate={state.settings.targetDate} onBack={() => navigateTo('hub')} />}
        {state.currentView === 'writing' && (
          <WritingSection 
            onBack={() => navigateTo(backView)} 
            onFavorite={(f) => setDoc(doc(db, "couples", state.coupleId, "favorites", f.id), f)} 
            onRecordEmotion={(id) => {
              const emotion = EMOTIONS[id];
              if (emotion && state.coupleId) {
                setDoc(doc(db, "couples", state.coupleId, "history", "hist_" + Date.now()), { id: "hist_" + Date.now(), emotionId: id, label: emotion.label, icon: emotion.icon, timestamp: Date.now() });
              }
            }} 
            onRecordChat={(c) => setDoc(doc(db, "couples", state.coupleId, "chats", c.id), c)} 
            onRecordDiary={() => {}} 
            onRemoveFavorite={(id) => deleteDoc(doc(db, "couples", state.coupleId, "favorites", id))} 
            favorites={state.favorites} 
            resumedChat={resumedChat} 
            resumedEmotion={resumedEmotion} 
          />
        )}
        {state.currentView === 'chats' && <ConversationHistorySection chats={state.chats} onDeleteChat={(id) => deleteDoc(doc(db, "couples", state.coupleId, "chats", id))} onClearChats={() => {}} onBack={() => navigateTo('hub')} onResumeChat={(c) => { setResumedChat(c); navigateTo('writing', 'chats'); }} />}
        {state.currentView === 'favorites' && <FavoritesSection favorites={state.favorites} onRemoveFavorite={(id) => deleteDoc(doc(db, "couples", state.coupleId, "favorites", id))} onBack={() => navigateTo('hub')} />}
        {state.currentView === 'settings' && <SettingsSection settings={state.settings} trashCount={state.trash.length} historyCount={state.history.length} onUpdate={updateSettings} onClear={() => { localStorage.removeItem(LOCAL_STORAGE_KEY); window.location.reload(); }} onBack={() => navigateTo('hub')} onOpenTrash={() => navigateTo('trash')} onOpenHistory={() => navigateTo('history', 'settings')} />}
        {state.currentView === 'trash' && <TrashSection trash={state.trash} onRestore={restoreFromTrash} onDelete={permanentlyDelete} onEmpty={emptyTrash} onBack={() => navigateTo('settings')} />}
        {state.currentView === 'history' && <HistorySection history={state.history} onClear={() => {}} onDeleteEntry={(id) => deleteDoc(doc(db, "couples", state.coupleId, "history", id))} onBack={() => navigateTo('settings')} onEntryClick={(entry) => { setResumedEmotion(entry.emotionId); navigateTo('writing', 'history'); }} />}
      </main>
    </>
  );
};

export default App;
