import { loadPosts } from "./loadPosts";

export async function loadUserInfo(url) {
   try {
      const res = await fetch(url);  // can be replaced by backend-API
      if (res.ok) {
         return await res.json();  
      } else {
         throw new Error('Error fetching user -- status: ' + res.status);
      }
   } catch (error) {
      console.warn(error); 
   }
}

export async function renderUserInfo() {
   const userData = await loadUserInfo('user.json');
   const { username, name, avatar, header, bio, user_location, join_date, followings_count, followers_count, posts_count } = userData;
   
   document.querySelector('.header__top-nav__user-info__username').innerText = name;
   document.querySelector('.header__top-nav__user-info__posts-count__num').innerText = posts_count;

   document.querySelector('.main__user-info__inner__header-img-cont__img').src = header;
   document.querySelector('.main__user-info__inner__info__avatar-cont__img-cont__img').src = avatar;
   document.querySelector('.main__user-info__inner__info__username-cont__username').innerText = name;
   document.querySelector('.main__user-info__inner__info__username-cont__id').innerText = username;
   document.querySelector('.main__user-info__inner__info__bio-cont__bio').innerText = bio;
   document.querySelector('.main__user-info__inner__info__location-join-cont__location__text').innerText = user_location;
   document.querySelector('.main__user-info__inner__info__location-join-cont__join-date').innerText = join_date;
   document.querySelector('.main__user-info__inner__info__follow-cont__following-cont__count').innerText = followings_count;
   document.querySelector('.main__user-info__inner__info__follow-cont__follower-cont__count').innerText = followers_count;

   loadPosts('user-panel');
}
