// Elements
let header;

let lastScrollY;
export const init = function() {
   // control header quiet-mode (navbars go away to leave more space to see tweets, when user scrolls down)
   header = document.querySelector('header');
   lastScrollY = 0;

   window.addEventListener('scroll', handleScroll);
   document.addEventListener('click', handleClick);

}

export const destroy = function() {
   window.removeEventListener('scroll', handleScroll);
   document.removeEventListener('click', handleClick);
}

function handleScroll(e) {
   if (document.scrollingElement !== document.documentElement) return;

   const scrollYDir = window.scrollY - lastScrollY;
   
   if (!header.classList.contains('quiet') && window.scrollY >= 400 && scrollYDir > 0 ) {
      header.classList.add('quiet');
   }
   
   if (header.classList.contains('quiet') && (scrollYDir < 0) ) {
      header.classList.remove('quiet');
   }

   if (scrollY <= 0) {
      document.querySelector('.header__top-nav__new-posts-btn-cont').classList.add('hidden');
      document.querySelector('header').classList.remove('quiet');
      return;
   } else {
      document.querySelector('.header__top-nav__new-posts-btn-cont').classList.remove('hidden');
   }

   lastScrollY = window.scrollY;
}

function handleClick(e) {
   const {target} = e;
   if (target.closest('.header__top-nav__new-posts-btn-cont')) {
      if (scrollY <= 0) return;
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      })
      target.closest('.header__top-nav__new-posts-btn-cont').classList.add('hidden');
      document.querySelector('header').classList.remove('quiet');
      return;
   }
}