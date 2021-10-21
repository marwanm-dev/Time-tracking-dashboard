import * as data from '/data.json';
// Variables
const stats = document.querySelector('.stats');
const reportSlide = document.querySelector('.options');
const options = document.querySelectorAll('.option');
let selectedTimeFrame = '';
let Duration = 750;

// Functions
// ? Gets correct url
const getImageUrl = (name, type = 'svg') => {
  const url = new URL(`/images/icon-${name}.${type}`, import.meta.url).pathname;
  const otherUrl = new URL(`/dist/assets/icon-${name}.${type}`, import.meta.url).pathname;
  return url === undefined ? otherUrl : url;
};
// ? Fetching
const getData = () => data.default;
// ? AnimateIn
const animateIn = () => {
  const cardSlides = document.querySelectorAll('.card-image');
  reportSlide.style.transform = 'translateY(0%)';
  reportSlide.style.opacity = 1;
  cardSlides.forEach(cardSlide => {
    cardSlide.style.transform = 'translateY(0%)';
    cardSlide.style.opacity = 1;
  });
};
// ? AnimateOut
const animateOut = () => {
  const cardSlides = document.querySelectorAll('.card-image');
  reportSlide.style.transform = 'translateY(-75%)';
  reportSlide.style.opacity = 0;
  cardSlides.forEach(cardSlide => {
    cardSlide.style.transform = 'translateY(50%)';
    cardSlide.style.opacity = 0;
  });
};
// ? Gets the activated Option
const getActiveOption = options => {
  options.forEach(option => {
    if (option.classList.contains('active')) {
      selectedTimeFrame = option.textContent;
    }
  });
  return selectedTimeFrame;
};
// ? Creating Cards
const createCards = cardsData => {
  cardsData.forEach(cardData => {
    getActiveOption(options);
    const cardHTML = `
            <div class="card-image">
                <div class="img"></div>
            </div>
            <div class="card-header">
                <h4 class="title">${cardData.title}</h4>
                <img
                    class="more-icon"
                    src="${getImageUrl('ellipsis', 'svg')}"
                />
            </div>
            <div class="card-timeframes">
                <h1 class="current">${
                  cardData.timeframes[selectedTimeFrame.toLowerCase()].current
                }hrs</h1>
                <p>Last Week - <span class="previous">${
                  cardData.timeframes[selectedTimeFrame.toLowerCase()].previous
                }hrs</span></p>
            </div>
        `;
    const card = document.createElement('div');
    const cardType = cardData.title.toLowerCase().split(' ').join('-');
    card.classList.add('card', `card-${cardType}`);
    card.innerHTML = cardHTML;
    stats.appendChild(card);
  });
  animateIn();
};
// ? Changes the Options
const changeOption = clickedOption => {
  animateOut();

  options.forEach(option => {
    option.classList.remove('active');
  });
  clickedOption.classList.add('active');
  updateCards(clickedOption.textContent);

  setTimeout(() => animateIn(), Duration);
};
// ? Updates the cards
const updateCards = async text => {
  const content = stats.querySelectorAll('.card > *');

  content.forEach(cardContent => (cardContent.style.opacity = 0));

  const data = await getData();
  setTimeout(() => {
    data.forEach(cardData => {
      const path = text.toLowerCase();
      const currentCard = stats.querySelector(
        `.card-${cardData.title.toLowerCase().split(' ').join('-')}`
      );
      currentCard.querySelector('.current').textContent = cardData.timeframes[path].current + 'hrs';
      currentCard.querySelector('.previous').textContent =
        cardData.timeframes[path].previous + 'hrs';
    });

    content.forEach(cardContent => (cardContent.style.opacity = 1));
  }, Duration);
};
// EventListeners
document.addEventListener('DOMContentLoaded', async () => {
  const data = await getData();
  createCards(data);
});
options.forEach(option => option.addEventListener('click', () => changeOption(option)));
