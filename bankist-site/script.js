'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

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

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// TOPIC: IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  const s1coordinates = section1.getBoundingClientRect();
  console.log(s1coordinates);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (x/y): ', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'Height/Width viewport: ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling:
  // Works only if we are currently positioned at the top of
  // the page:
  // window.scrollTo(s1coordinates.left, s1coordinates.top);

  // Solution:
  // window.scrollTo(
  //   s1coordinates.left + window.pageXOffset,
  //   s1coordinates.top + window.pageYOffset
  // );

  // Even nicer solutio (but old-school):
  // window.scrollTo({
  //   left: s1coordinates.left + window.pageXOffset,
  //   top: s1coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way:
  section1.scrollIntoView({ behavior: 'smooth' });
});

// TOPIC: EVENT DELEGATION (IMPLEMENTING PAGE NAVIGATION)

// One (not so efficient) solution:
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('LINK');

//     const id = this.getAttribute('href');
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation:
//      1) Add event listener to common parent element
//      2) Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);

  // Matching strategy:
  if (e.target.classList.contains('nav__link')) {
    // console.log('LINK');
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TOPIC: BUILDING A TABBED COMPONENT

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // If we click anywhere outside the buttons
  // (but wish to avoid TypeError):
  if (!clicked) return;

  // Activate tab:
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  clicked.classList.add('operations__tab--active');

  // Activate content area:
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// TOPIC: PASSING ARGUMENTS TO EVENT HANDLERS

// Menu fade animation (when we hover over a link, others
// automatically fade):
const handleHover = function (e) {
  // console.log(this, e.currentTarget);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const otherLinks = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    otherLinks.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// One solution:
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// Opposite of 'mouseover':
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Cleaner solution:
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// TOPIC: IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT
/*
// Navigation bar becomes attached to the top of a page, no
// matter how far we scroll down...

const initialCoordinates = section1.getBoundingClientRect();

// 'scroll' event should be avoided because of it's lack of
// effectivness...
window.addEventListener('scroll', function (e) {
  // console.log(window.scrollY);

  // We want to make navigation sticky as soon as we come to
  // the first section:
  if (window.scrollY > initialCoordinates.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

// TOPIC: A BETTER SOLUTION: THE INTERSECTION OBSERVER API

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px', // 90px is the height of navigation
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// TOPIC: REVEALING ELEMENTS ON SCROLL

// Reveal sections:
const revealSection = function (entries, observer) {
  const [entry] = entries; // same as const entry = entries[0]
  // since we only have one threshold
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // 'entry.target' so that we know which section exactly are
  // we approaching:
  entry.target.classList.remove('section--hidden');

  // Once all are revealed, there is now need to do the special
  // revealing again (for better performance):
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);

  // Firstly, we should add 'section-hidden' css attribute to
  // all of the sections in html:
  section.classList.add('section--hidden');
});

// TOPIC: LAZY LOADING IMAGES

// Images affect the performance the most!

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src:
  entry.target.src = entry.target.dataset.src;

  // Now we have to unblur it:

  // This won't work properly:
  // entry.target.classList.remove('lazy-img');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // to load the images a little bit before we reach them:
  // rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// TOPIC: BUILDING A SLIDER COMPONENT (PART 1)

let currSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

// Added functionalities for the dots (from PART 2):
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
// createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
// activateDot(0);

// Firstly, let's put all slides side by side...
// First slide should be at 0%, second at %100, third at 200%:
// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
// goToSlide(0);

// Let's temporarly scale down the practice slides and make
// them visible so we can see them more clearly:
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.3) translateX(-1100px)';
// slider.style.overflow = 'visible'; // opposed to 'hidden'

// Go to the next slide (basically changing the percentages):
const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

const previousSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

// We obviously have a lot of funcion calls for the default
// case (one when we reload the page):
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

// TOPIC: BUILDING A SLIDER COMPONENT (PART 2)

document.addEventListener('keydown', function (e) {
  console.log(e); // so we can figure out official key names
  if (e.key === 'ArrowLeft') previousSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // console.log('DOT');
    const { slide } = e.target.dataset;

    goToSlide(slide);
    activateDot(slide);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  LECTURES  //////////////////////////

// TOPIC: HOW THE DOM REALLY WORKS? (185)
/*
DOM - an interface between our JS code and the browser, or more
      specifically, html documents that are randerred in and by
      the browser.
    - allows us to make JS interact with the browser.
    - allows us to write JS to create, modifyand delete HTML
      elements set styles, classes and attributes, and listen
      and respond to events.
    - tree is generated from an HTML document, which we can
      then interact with.
    - is a very complex API that contains lots of methods and
      properties to interact with the DOM tree.

HOW IS THE DOM API ORGANIZED BTS?
- Every single node of a DOM tree is of a type called Node. And
  such as everything else in JS, each Node is represented by JS
  object. This object gets the access to special Node methods
  and properties (e.g. .textContent, .childNodes, .parentNode,
  .cloneNode()).
  Node type has couple of child types: Element, Text, Comment,
  Document. 
*/

// TOPIC: SELECTING, CREATING AND DELETING ELEMENTS
/*
// Selecting elements:
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//-------------------------------------------------------------

// Creating and inserting elements:
// .insertAdjacentHTML (known from previous section)
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // at the top of the header
header.append(message); // at the bottom of the header
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

//-------------------------------------------------------------

// Delete elements:
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // Quite recent way:
    message.remove();

    // Old way:
    // message.parentElement.removeChild(message);
  });
*/

// TOPIC: STYLES, ATTRIBUTES AND CLASSES
/*
// Styles:
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// We get nothing:
console.log(message.style.height);
// We get the result because it's an inline style (the one we
// set manually ourselves):
console.log(message.style.backgroundColor);
// What will always work:
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
console.log(getComputedStyle(message).height);

// style.css (root)
document.documentElement.style.setProperty('--color-primary', 'orangered');

//-------------------------------------------------------------

// Attrubutes:
const logo = document.querySelector('.nav__logo');

// Standard attributes:
console.log(logo.alt);
console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
console.log(logo.alt);

// Non-standard (undefined):
console.log(logo.designer);
// But there is a way:
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

const btn = document.querySelector('.nav__link--btn');
console.log(btn.href);
console.log(btn.getAttribute('href'));

// Data attributes:
console.log(logo.dataset.versionNumber);

//-------------------------------------------------------------

// Classes:
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use:
// logo.className = 'jonas';
*/

// TOPIC: TYPES OF EVENTS AND EVENT HANDLERS
/*
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great!');

  // So that we can only listen to the event once:
  h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

// Kind of pointless:
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// Old-school:
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great!');
// };

// Third way of doing so in doing it directly in HTML...
*/

// TOPIC: EVENT PROPAGATION IN PRACTICE(BUBBLING AND CAPTURING)
/*
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  // console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation:
  // e.stopPropagation();
});

// 'nav__links' is the parent of 'nav__link'
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log('LINKS');
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

// the parent of previous two
document.querySelector('.nav').addEventListener('click', function (e) {
  // console.log('NAV');
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

// TOPIC: DOM TRAVERSING
/*
const h1 = document.querySelector('h1');

// Going downwards: children
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';
console.log('\n');
//-------------------------------------------------------------

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// we can also use custom css properties
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';
console.log('\n');
//-------------------------------------------------------------

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

// TOPIC: A BETTER SOLUTION: THE INTERSECTION OBSERVER API
/*
// It will be called whenever the chosen element is interse-
// cting with our target (at given percentage):
const observerCallback = function (entries, observer) {
  // Entries actually refers to thershold, because it can be
  // an array:
  entries.forEach(entry => {
    console.log(entry);
  });
};

const observerOptions = {
  // The element that the target is intersecting (when we write
  // null our element is actually the entire viewport):
  root: null,
  // The percentage of intersection at which the observer
  // callback will be called:
  // thershold: 0.1, // 10%
  thershod: [0, 0.2],
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1); // section1 is the target

// Let's go bac to our app!
*/

// TOPIC: LIFECYCLE DOM EVENTS
/*
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
*/

// TOPIC: EFFICIENT SCRIPT LOADING: DEFER AND ASYNC

// Regular way: <script src="script.js"> (always at the end of
//                                        the html body)
//    - Scripts are fetched and executed after the HTML
//      is completely parsed.
//    - Use if you need to support old browsers.

// ASYNC: <script async src="script.js"> (always in the head of
//                                        the html)
//    - Scripts are fetched asynchronously and executed
//      immediately.
//    - Usually the DOMContentLoaded event waits for all
//      scripts to execute, except for async scripts. So,
//      DOMContentLoaded does not wait for an async script.
//    - Scripts not guaranteed to exceute in order.
//    - Use for 3rd-party scripts where order doesn't matter
//      (e.g. Google Analytics).

// DEFER: <script defer src="script.js"> (always in the head of
//                                        the html)
//    - Scripts are fetched asynchronously and executed
//      after the HTML is completely parsed.
//    - DOMContentLoaded event fires after defer script
//      is executed.
//    - Scripts are executed in order.
//    - This is overall the best solution! Use for your
//      own scripts, and when order matters (e.g. when
//      including a library).
