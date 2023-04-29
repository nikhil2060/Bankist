'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

//NAV

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//DOM Travesing******************************************************************
//Going downwards in dom

const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
// h1.firstElementChild.style.color = 'white';

//going upwards

//TABBED COMPONENT********************************************************************

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(function (e) {    //THIS WILL BULK LOAD THE WEBSITE
//   e.addEventListener('click', function (el) {
//     console.log('HELLO BETEEE');
//   });
//});

//NEW METHOD - EVENT BUBBLING

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //IF NOT CLICKED THEN IT WILL THROW ERROR
  //GURAD CLASS

  if (!clicked) return;

  //ACTIVE TAB
  tabs.forEach(e => e.classList.remove('operations__tab--active'));
  clicked?.classList.add('operations__tab--active');

  //Activate content Area
  tabsContent.forEach(e => e.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//TABBED COMP END********************************************************************

//MENU fade animation************************************************************
const nav = document.querySelector('.nav');

const handleHover = function (e, op) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = op;
    });

    logo.style.opacity = op;
  }
};

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//Sticky Navigation************************************************************

// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//InterSection observer API**********************************************
//************************************************************** */
// const obsCallBack = function (enteries, observer) {
//   enteries.forEach(entry => console.log(entry));
// };

// const opsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observerKaro = new IntersectionObserver(obsCallBack, opsOptions);
// observerKaro.observe(section1);

//Sticky Navigation WITH InterSection observer API************************

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const strikyNav = function (enteries) {
  const [entry] = enteries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const opsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(strikyNav, opsOptions);

headerObserver.observe(header);

//Sticky Navigation WITH InterSection observer API END************************

//Revealing Elements on scroll*********************

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; //Guard Class
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const opt = {
  root: null,
  threshold: 0.145,
};

const sectionObserver = new IntersectionObserver(revealSection, opt);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');s
});

//Revealing Elements on scroll END*****************************************

//Lazy Loading Images on scroll*****************************************

const allImages = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace Src with DataSrc
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const opts = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imageObserver = new IntersectionObserver(loadImg, opts);

allImages.forEach(imag => imageObserver.observe(imag));
//Lazy Loading Images on scroll END*****************************************

//InterSection observer API END **************************************************
// *********************************************************

//SLIDER COMPONENT *********************************************************

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlides = slides.length;

// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
//0% 100% 200% 300%

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(e => e.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const gotoSlide = slide =>
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );

gotoSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlides - 1) curSlide = 0;
  else curSlide++;

  gotoSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlides - 1;
  else curSlide--;

  gotoSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//HandLing KeyBoard Events

document.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowLeft') prevSlide();
  else if (e.key == 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;

    gotoSlide(slide);
  }
});

//SLIDER COMPONENT END*********************************************************

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
/////////////////////////////////////////

//TO ACCESS document element
// console.log(document.documentElement);

// const header = document.querySelector('.header');

// const allSection = document.querySelectorAll('.section');
// console.log(allSection);

// //Creating an element

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `We use Cookies for extra funtionality <button class="btn btn--close--cookie">Got it</button>`;

// header.prepend(message);

// //deleting Elements;
// message.addEventListener('click', function () {
//   message.remove();
// });

// //styles
// message.style.backgroundColor = '#333';
// message.style.width = '120%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// //css Variables

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes

// const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt);

// //data Attribute
// console.log(logo.dataset.versionNumber);

//classes

// logo.classList.add('c','d','e');
// logo.classList.remove('');
// logo.classList.contains('');
// logo.classList.toggle('');

//////////////////////////////////

//SMOOTH SCROLL BEHAVIOUR

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();

// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );

//OLD WAY
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth',
// });

//newWAY
//   section1.scrollIntoView({ behavior: 'smooth' });

//   // EVENTS
// });

// const h1 = document.querySelector('h1');
// // h1.addEventListener('mouseenter', function (e) {
// //   alert('OHH YEAH DAYADDY');
// // });

// //new Method to add Event

// h1.onmouseenter = function (e) {
//   alert('HELLO BABAY');
// };
