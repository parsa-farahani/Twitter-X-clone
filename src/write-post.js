import { getDB, createDB, addPostToDB, getPostFromDB, deletePostFromDB } from "./idb-control";

let attachedMedias;

let db;
let postsCont = 0;

export async function init(pdb, userPostsCont=0) {
   db = pdb;
   postsCont = userPostsCont

   attachedMedias = new Set();

   document.querySelectorAll('textarea').forEach(ta => {
      ta.value = "";
      
      ta.addEventListener('input', function () {
         this.style.height = 'auto'; // Reset height
         this.style.height = this.scrollHeight + 'px'; // Set height to scrollHeight(so it will extend vertically without any scrolling)
       
         if (ta.value.length > 0) {
            document.querySelector('.post-btn').disabled = false;
         } else {
            document.querySelector('.post-btn').disabled = true;
         }
      });
   })
   
   document.addEventListener('click', e => {
      if (e.target.closest('.post-btn')) {
         publishPost();
         document.querySelector('textarea').value = "";
         document.querySelector('.header__top-nav__row--user-home-links__back-home-link').click();
      }
   })
}

export function publishPost() {
   const postObject = {
      post_id: postsCont ? postsCont - 1 : 0,
      author_id: '@parsa04',   // should be set dynamically based on current-user 
      referred_id: null,
      content: document.querySelector('.post-content__context__form__inp').value,
      media_srcs: Array.from( attachedMedias ),
      comments_ids: [],
      posting_date: new Date().toISOString(),
      comments_count: 0,
      reposts_count: 0,
      likes_count: 0,
      view_count: 0,
   };

   sendPostToServer( JSON.stringify(postObject) );
   savePostToIDB( postObject );
}

export async function sendPostToServer( postStr ) {
   /* needs backend API */
   /* Fetch/XHR POST request */
}

// indexedDB controls
// let idb;
async function openDatabase() {
   idb = await idb.open.open('twitter', 1, {})
}

async function savePostToIDB( postStr ) {
   await addPostToDB(postStr);
}