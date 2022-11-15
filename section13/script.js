'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(x => x.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', e => {
  const section1Coords = section1.getBoundingClientRect(); // relative to viewport

  console.log('Current scroll', window.scrollX, window.scrollY);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // window.scrollTo({
  //   behavior: 'smooth',
  //   left: section1Coords.left + window.scrollX,
  //   top: section1Coords.top + window.scrollY,
  // }); // OLD WAY

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
// document.querySelectorAll('.nav__link').forEach(x => {
//   x.addEventListener('click', e => {
//     e.preventDefault();
//     const id = e.currentTarget.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  const { tab: tabNumber } = clicked.dataset;

  tabs.forEach(x => x.classList.remove('operations__tab--active'));

  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(x => {
    x.classList.remove('operations__content--active');

    if (x.classList.contains(`operations__content--${tabNumber}`))
      x.classList.add('operations__content--active');
  });
});

// Menu fade animation
const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    [...siblings, logo].forEach(x => {
      if (x !== link) x.style.opacity = opacity;
    });
  }
};

nav.addEventListener('mouseover', e => {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  handleHover(e, 1);
});

// Sticky navigation
// Scroll Event should be avoided
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Intersection Observer API
// const obsCallback = (entries, observer) => {
//   entries.forEach(x => console.log(x));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

// root: null = viewport
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach(x => {
  sectionObserver.observe(x);
  x.classList.add('section--hidden');
});

// Lazy loading images
const imgsTargets = document.querySelectorAll('img[data-src]');
const lazyLoading = ([entry], observer) => {
  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', entry.target.dataset.src);
  entry.target.addEventListener('load', e => {
    e.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyLoadingObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0.2,
  rootMargin: '-200px',
});

imgsTargets.forEach(x => lazyLoadingObserver.observe(x));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const goToSlide = slide => {
  slides.forEach(
    (x, i) => (x.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const moveSlide = (resetCondition, resetValue, slideIncrement) => {
  if (currentSlide === resetCondition) currentSlide = resetValue;
  else currentSlide += slideIncrement;

  goToSlide(currentSlide);
};

const updateDotsStyle = currentSlide => {
  [...dotContainer.children].forEach((x, i) => {
    x.classList.remove('dots__dot--active');

    if (i === currentSlide) x.classList.add('dots__dot--active');
  });
};

const init = () => {
  goToSlide(0);

  createDots();

  updateDotsStyle(currentSlide);
};

init();

const nextSlide = () => {
  moveSlide(maxSlide - 1, 0, 1);
  updateDotsStyle(currentSlide);
};

const previousSlide = () => {
  moveSlide(0, maxSlide - 1, -1);
  updateDotsStyle(currentSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') previousSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot'))
    [...e.target.parentElement.children].forEach(x =>
      x.classList.remove('dots__dot--active')
    );

  e.target.classList.add('dots__dot--active');

  goToSlide(e.target.dataset.slide);
});
// LECTURES

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// const allButtons2 = document.getElementsByClassName('btn');
// console.log(allButtons2);

// // document.body.insertAdjacentHTML('afterbegin', '<h1>Hello</h1>');

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // header.prepend(message);
// document.querySelector('.header').append(message);
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
//   // message.parentElement.removeChild(message); // OLD
// });

// message.style.backgroundColor = '#37383d';
// message.style.width = '105%';

// console.log(message.style);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);
// console.log(logo.dataset.designer);
// console.log(logo.getAttribute('designer'));
// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'Bankist');
// logo.dataset.company = 'Bankist';

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// const h1 = document.querySelector('h1');

// const alertH1 = e => {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);

// h1.onmouseenter = e => {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', e => {
//   e.target.style.backgroundColor = randomColor();
//   // e.stopPropagation(); // Not Good Idea
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.currentTarget.style.backgroundColor = randomColor(); // e.currentTarget === this
// });

// Event delegation
// document.querySelector('.nav').addEventListener('click', e => {
//   e.target.style.backgroundColor = randomColor();
// });
// const h1 = document.querySelector('h1');

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(x => {
//   if (x !== h1) {
//     x.style.transform = 'scale(0.5)';
//   }
// });

document.addEventListener('DOMContentLoaded', e => {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', e => {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'Are you sure you want to exit?';
// });
