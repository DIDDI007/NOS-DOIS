
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Log de versão para debug no console do navegador
console.log("Versão PWA: 1.0.7 - Ready for Install");

// Registro do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado com sucesso:', registration.scope);
      })
      .catch(err => {
        console.error('Falha ao registrar SW:', err);
      });
  });
}

// Lógica de Instalação PWA
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Evento beforeinstallprompt disparado!');
  // Impede que o navegador mostre o prompt automático
  e.preventDefault();
  // Armazena o evento globalmente para uso posterior
  window.deferredPrompt = e;
  // Notifica o app que a instalação está disponível
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
});

window.addEventListener('appinstalled', (evt) => {
  console.log('App instalado com sucesso!');
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
