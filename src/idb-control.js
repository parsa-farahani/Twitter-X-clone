import { openDB } from "idb";

let db;
let dbPromise;

export function getDB() {
   return dbPromise ? Promise.resolve(dbPromise) : Promise.reject("Database not initialized");
   // console.log(db);
   // return db;
}

export async function createDB() {
   dbPromise = openDB('twitter', 1, {
      upgrade(db, oldVersion, newVersion, tx) {
         if (!db.objectStoreNames.contains('accounts')) {
            const accountsObjectStore = db.createObjectStore('accounts', {keyPath: 'id', autoIncrement: true});
         }
         if (!db.objectStoreNames.contains('tweets')) {
            const tweetsObjectStore = db.createObjectStore('tweets', {keyPath: 'id', autoIncrement: true});
            tweetsObjectStore.createIndex('post_id', 'post_id');
         }
         // switch(oldVersion) {
         //    case 0:
         // }
      }
   })
   db = await dbPromise;
   console.log(dbPromise);
   return dbPromise;
}

// account controls
export async function addAccountToDB(account) {
   const tx = await window.db.transaction('accounts', 'readwrite');
   const accounts = tx.objectStores('accounts');
   accounts.add(account);
   await tx.done;
}

export async function getAccountFromDB(postId=null) {
   // const tx = await db.transaction('tweets', 'readwrite');
   // const tweets = tx.objectStores('tweets');
   // tweets.add(post);
   // await tx.done;
}

export async function deleteAccountFromDB(postId) {
   // const tx = await db.transaction('tweets', 'readwrite');
   // const tweets = tx.objectStores('tweets');
   // tweets.add(post);
   // await tx.done;
}

// post(tweets) controls
export async function addPostToDB(post) {
   const tx = db.transaction('tweets', 'readwrite');
   const tweets = tx.objectStore('tweets');
   tweets.put(post);
   await tx.done;
}

export async function getPostFromDB(postId=null) {
   const tx = db.transaction('tweets', 'readwrite');
   const tweets = tx.objectStore('tweets');
   let result;
   if (postId === null) {
      result = await tweets.getAll();     
   } else {
      const postIdIndex = tweets.index('post_id');
      result = await postIdIndex.get(postId);
   }
   await tx.done;
   return result;
}

export async function deletePostFromDB(postId) {
   const tx = db.transaction('tweets', 'readwrite');
   const tweets = tx.objectStore('tweets');
   const postIdIndex = tweets.index('post_id');

   let record = await postIdIndex.get(postId);
   let result = tweets.delete(record.id);

   await tx.done;
   return result;
}

