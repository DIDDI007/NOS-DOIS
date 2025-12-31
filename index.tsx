import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Log de versão para debug no console do navegador
console.log("Versão PWA: 1.1.0 - Robust SW Register");

// Registro do Service Worker de forma mais segura para evitar erros de origem
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Tenta registrar o SW usando o caminho relativo direto ao host atual
    const swPath = 'sw.js'; 
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('SW registrado com sucesso no escopo:', registration.scope);
      })
      .catch(err => {
        console.warn('Falha ao registrar SW (Pode ser esperado em ambientes de preview):', err.message);
      });
  });
}

// Lógica de Instalação PWA
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Evento beforeinstallprompt disparado!');
  e.preventDefault();
  window.deferredPrompt = e;
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