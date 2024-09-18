import { getPostFromDB } from "./idb-control";

export function loadPosts(area='feed', id=null) {  // area: (feed, user-panel, comments, ...) | id: if we loading page of a 'psot, we pass its id, to load its data in post page'
   try {
      if (area === 'feed') {
         renderFeedPosts();
         return;
      }
      if (area === 'user-panel') {
         renderUserPosts();
         return;
      }
      if (area === 'post') {
         const strPostObject = localStorage.getItem('current_post');  // for now that we haven't back end API
         renderPostPage( JSON.parse(strPostObject) );  // sending post-data(instead of backend-fetch), to render it
         return;
      }
   } catch (error) {
      console.warn('Error Loading Posts: ' , error);
   }
}

async function renderUserPosts() {
   const userPostsCont = document.querySelector('.main__posts-cont');
   const posts = await getPostFromDB();
   if (!posts.length) {  // so we should fetch user-posts from server (needs backend API so we now dont use it)
      /* get posts from server */
   } else {
      posts.forEach(async (post) => {
         const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)
         const userTweetEl = createPostEl(author, post);
         userTweetEl.classList.add('user-post');
         userPostsCont.prepend(userTweetEl);
      })
   }
}

async function renderPostPage(curntPost) {
   // the post itself
   const mainPostContEl = document.querySelector('.main__post-cont');
   const author = await fetch('user.json').then(res => res.json());  // for now that we haven't back end API, actually it can be gotten by 'curntPost.author_id'

   const curntPostEl = createPostEl(author, curntPost);
   curntPostEl.classList.add('focused');
   mainPostContEl.append(curntPostEl);

   // comments:  loading comments is done, by giving 'curntPost.comments_ids' to 'backend API', so for now, we havent backend API, so we load the from a json file(as placeholder)
   const commentsContEl = document.querySelector('.main__comments-cont');
   const commentPosts = await fetch('comments.json').then(res => res.json());
   // const commentPosts = await loadComments();

   [...commentPosts].forEach(async (post) => {
      const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)
      const userTweetEl = createPostEl(author, post);
      commentsContEl.prepend(userTweetEl);
   })
}


async function loadFeedPosts( kind="foryou" ) {  // kind: foryou/following
   try {
      const res = await fetch('tweets.json');
      if (res.ok) {
         return await res.json();
      } else {
         throw new Error('Error fetching posts - status: ' + res.status);
      }
   } catch (error) {
      console.warn(error);
   }
}

async function renderFeedPosts() {
   const postsCont = document.querySelector('.main__posts-cont');
   const posts = await loadFeedPosts();  // Array of posts(feed/global)

   [...posts].forEach(async (post) => {
      const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)
      const userTweetEl = createPostEl(author, post);
      postsCont.prepend(userTweetEl);
   })
}

// cretaes <user-tweet> (and sets all of its info-attributes), and returns it
function createPostEl(authorObj, postObj) {
   const { avatar, name, username } = authorObj;
   const { post_id, referred_id, posting_date, content, media_srcs, comments_ids, comments_count, reposts_count, likes_count, view_count } = postObj;

   const userTweetEl = document.createElement('user-tweet');
   userTweetEl.setAttribute('data-post-id', post_id);
   userTweetEl.setAttribute('data-author-avatar', avatar);
   userTweetEl.setAttribute('data-author-username', name);
   userTweetEl.setAttribute('data-author-id', username);
   userTweetEl.setAttribute('data-referred-id', referred_id);
   userTweetEl.setAttribute('data-datetime', posting_date);
   userTweetEl.setAttribute('data-content', content);
   userTweetEl.setAttribute('data-media-srcs', (typeof media_srcs != 'string') ? JSON.stringify(media_srcs) : media_srcs);   // Array of srcs
   userTweetEl.setAttribute('data-comments-ids', (typeof comments_ids != 'string') ? JSON.stringify(comments_ids) : comments_ids);  // Array of comments-id s
   userTweetEl.setAttribute('data-comments-count', comments_count);
   userTweetEl.setAttribute('data-reposts-count', reposts_count);
   userTweetEl.setAttribute('data-likes-count', likes_count);
   userTweetEl.setAttribute('data-view-count', view_count);

   return userTweetEl;
}