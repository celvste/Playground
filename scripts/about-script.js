
const imageFolderPath = 'imgs/map/';
const images = [
    'chapteh.png',
    'five-stones.png',
    'fortnite.png',
    'game-boy.png',
    'gasing.png',
    'lego.png',
    'ludo.png',
    'minecraft.png',
    'nerf-guns.png',
    'nintendo-switch.png',
    'pick-up-sticks.png',
    'pokemon-trading-card-game.png',
    'pop-mart.png',
    'sylvanian-families.png',
    'tamagotchi.png'
];

let currentIndex = 0;
const slideshowImage = document.getElementById('slideshow');

function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    if (slideshowImage) {
        slideshowImage.src = imageFolderPath + images[currentIndex];
        console.log('Current Image:', slideshowImage.src); // Debugging: log current image path
    } else {
        console.error('Slideshow image element not found');
    }
}

function preloadImages() {
    images.forEach(image => {
        const img = new Image();
        img.src = imageFolderPath + image;
    });
}

window.onload = function() {
    preloadImages();
    setInterval(showNextImage, 2000); // Change image every 3 seconds
};