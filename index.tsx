import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro Robusto do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado:', registration.scope);
      })
      .catch(err => {
        console.warn('Erro ao registrar SW:', err);
      });
  });
}

// Captura do evento de instalação para o Chrome
window.addEventListener('beforeinstallprompt', (e) => {
  // Impede que o mini-infobar apareça no mobile
  e.preventDefault();
  // Guarda o evento para ser usado depois
  window.deferredPrompt = e;
  // Dispara um evento customizado para o React saber que pode instalar
  window.dispatchEvent(new Event('can-install-pwa'));
});

// Interface global para o TypeScript não reclamar
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