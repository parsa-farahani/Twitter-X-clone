import { createDB } from "./idb-control";
import { loadPosts } from "./loadPosts";
import { renderUserInfo, loadUserInfo } from "./user-panel";
import './styles/index.scss';



// setting-up service-worker
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
         .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
               
            registration.onupdatefound = () => {
               const newWorker = registration.installing;
               
               newWorker.onstatechange = () => {
                  if (newWorker.state === 'installed') {
                     if (navigator.serviceWorker.controller) {
                        console.log('New version available! Refresh to update.');  
                     }
                  }
               }
            }
         }).catch(error => {
           console.error('Service Worker registration failed:', error);
         })
      ;
   });
}


// setting dark/light theme on body -> css-variables
if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
   document.body.classList.add('darktheme');
}



