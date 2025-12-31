
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro Robusto do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registrado com sucesso:', registration.scope);
        
        // Listener para atualizações do app
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível! Você poderia mostrar um aviso "Atualizar App" aqui.
                console.log('Nova versão do Refúgio disponível. Recarregando...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch(err => {
        console.warn('PWA Offline não suportado neste ambiente (provavelmente falta HTTPS ou estamos em localhost sem flags).');
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
