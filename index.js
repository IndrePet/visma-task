'use strict';
const containerLeft = document.querySelector('.left');
const containerRight = document.querySelector('.img-large');
const authorInfo = document.querySelector('#author');
const sizeInfo = document.querySelector('#img-size');
const greyscale = document.querySelector('#greyscale');
const blurSlider = document.querySelector('#blur');

let apiPage = 1;

/**
 * Imports the image list from API (Lorem picsum) and sends it to `loadThumbnails` function
 * @param {number} apiPage Number of the page images have to be fetched from
 * @param {number} limit Number of images that need to be fetched per request `default = 4`
 */
const getImageList = (apiPage, limit = 4) => {
  fetch(`https://picsum.photos/v2/list?page=${apiPage}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => loadThumbnails(element));
    });
};

/**
 * Renders the page sidebar.
 * - Creates a gallery of images,
 * - Prevents right-click on them,
 * - Listens to 'click' events on created images,
 *    - Calls function `toLarge` to enlarge selected image,
 *    - Listens to filter input and calls functions to render a enlarged image
 * @param {object} data parsed JSON object
 */
const loadThumbnails = (data) => {
  console.log(typeof data);
  const imgThumb = document.createElement('img');
  imgThumb.setAttribute('src', data.download_url);
  imgThumb.classList.add('thumbnail');
  containerLeft.appendChild(imgThumb);

  imgThumb.addEventListener('contextmenu', (event) => event.preventDefault());

  imgThumb.addEventListener('click', () => {
    containerRight.innerHTML = '';
    sizeInfo.innerText = '';
    authorInfo.innerText = '';
    const rightSide = new RightSide(data);
    rightSide.toLarge(blurSlider.value);

    greyscale.addEventListener('change', () => {
      rightSide.newRender(blurSlider.value);
    });

    blurSlider.addEventListener('change', () => {
      rightSide.newRender(blurSlider.value);
    });
  });
};

/**
 * A class to create an object meant to render the enlarged image panel and apply selected filters to the image
 */

class RightSide {
  constructor(data) {
    this.id = data.id;
    this.width = data.width;
    this.height = data.height;
    this.author = data.author;
    this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}`;
  }

  /**
   * Renders the right side panel image and modifies the image source
   * url according to Lorem Picsum documentation based on the user's
   * selected filter values
   *
   * Prevents image from being saved by disabling right click
   * @param {number} blurValue A value of range type input
   */
  toLarge(blurValue) {
    if (greyscale.checked && parseInt(blurValue) === 0) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?grayscale`;
    } else if (blurValue > 0 && !greyscale.checked) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?blur=${blurValue}`;
    } else if (greyscale.checked && blurValue > 0) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?grayscale&blur=${blurValue}`;
    } else {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}`;
    }
    const imgLarge = document.createElement('img');
    imgLarge.setAttribute('src', this.url);
    imgLarge.classList.add('enlarged');
    containerRight.appendChild(imgLarge);
    authorInfo.innerText = `${this.author}`;
    sizeInfo.innerText = `${this.width}px / ${this.height}px`;

    imgLarge.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  /**
   * Resets the right side panel image in order to prepare it for
   * a new render
   * @param {number} blurValue Range type input's value passed to the new render `default = 0`
   */
  newRender(blurValue = 0) {
    containerRight.innerHTML = '';
    this.toLarge(blurValue);
  }
}

getImageList();

/**
 * Event listener to create a responsive infinite scroll.
 * - Vertical infinite scroll on large screen devices
 * - Horizontal infinite scroll on small screen devices
 */
containerLeft.addEventListener('scroll', () => {
  let imageLimit = 1;
  if (window.innerWidth > 800) {
    if (
      containerLeft.scrollHeight - containerLeft.offsetHeight <=
      Math.ceil(containerLeft.scrollTop)
    ) {
      getImageList(++apiPage, imageLimit);
    }
  } else {
    if (
      containerLeft.scrollWidth - containerLeft.offsetWidth <=
      Math.ceil(containerLeft.scrollLeft)
    ) {
      getImageList(++apiPage, imageLimit);
    }
  }
});
