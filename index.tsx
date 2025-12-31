import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro do Service Worker com log de depuração aprimorado
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('PWA: Service Worker registrado com sucesso:', reg.scope);
      })
      .catch(err => {
        console.warn('PWA: Falha no registro do Service Worker:', err);
      });
  });
}

// Lógica de Captura do Botão de Instalação (Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: Evento beforeinstallprompt capturado!');
  // Impede que o navegador mostre o banner automático
  e.preventDefault();
  // Guarda o evento para ser usado nos Ajustes
  window.deferredPrompt = e;
  // Notifica o app que a instalação está disponível
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
});

window.addEventListener('appinstalled', (evt) => {
  console.log('PWA: Aplicativo instalado na tela inicial.');
  window.deferredPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: false }));
});

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);