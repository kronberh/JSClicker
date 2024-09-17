import { upgradeData } from "./locSpecificUpgradeData.js";
import { renderLocationUpgrades, removeLocationUpgrades } from "./dom.js";
import { fetchLocalStorage, initializeFromGameConfig, writeToLocalStorage } from "./data.js";

export const locSpecificUpgradesList = document.querySelector('#loc_specific');
export const counter = document.querySelector('.current_coins');

export const gameData = fetchLocalStorage() ?? {
    coinsAmount: 999_999, 
    coinsBonusPerClick: 1,
    coinsPerSecond: 0,
    upgradesPurchased: {
        general: { },
        desert: { },
    },
    callbacks: []
};

const gameCanvas = document.querySelector('#gameCanvas');
const clickButton = document.querySelector('#clicker');
const photoButton = document.querySelector('#photo');
const gameGrid = document.querySelector('#gameGrid');
const svgControls = document.getElementById('svg-controls');
const svgImages = document.querySelectorAll('#gameCanvas image');

photoButton.addEventListener('click', () => {
    function cloneSVG(svg) {
        return svg.cloneNode(true);
    }
    function convertImageToBase64(url, callback) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        };
        img.onerror = function() {
            console.error('Failed to load image: ' + url);
            callback(null);
        };
        img.src = url;
    }
    function convertAllImagesToBase64(svgElement, callback) {
        const images = svgElement.querySelectorAll('image');
        let remaining = images.length;
        if (remaining === 0) {
            callback();
            return;
        }
        images.forEach(img => {
            const href = img.getAttribute('href');
            if (href.startsWith('data:')) {
                remaining--;
                if (remaining === 0) callback();
                return;
            }
            convertImageToBase64(href, base64 => {
                if (base64) img.setAttribute('href', base64);
                remaining--;
                if (remaining === 0) callback();
            });
        });
    }
    const clonedSvg = cloneSVG(gameCanvas);
    convertAllImagesToBase64(clonedSvg, function() {
        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob(function(blob) {
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl);
            }, 'image/png');
        };
        img.src = url;
    });
});

svgImages.forEach((image, index) => {
    const button = document.createElement('button');
    button.innerHTML = `<img src="${image.getAttribute('href').replace(/\.[^/.]+$/, "")}_icon.svg" alt="icon"> Toggle ${image.getAttribute('href')}`;
    button.dataset.target = index;
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        const element = svgImages[target];
        if (element) {
            if (element.style.display === 'none') {
                element.style.display = 'inline';
                button.classList.remove('toggled');
            } else {
                element.style.display = 'none';
                button.classList.add('toggled');
            }
        }
    });
    svgControls.appendChild(button);
});

clickButton.addEventListener('click', () => {
    gameData.coinsAmount += gameData.coinsBonusPerClick;
    counter.innerHTML = gameData.coinsAmount;
});

function renderLocations(){
        upgradeData.forEach(locData => {
        const div = document.createElement('div');
        div.classList.add('gameCanvas-cover');
        div.id = locData.name;
        div.innerHTML = locData.name;

        div.addEventListener('click', () => {
            removeLocationUpgrades(div);
            renderLocationUpgrades(locData);
        });

        gameGrid.appendChild(div);
    });
}


initializeFromGameConfig(gameData);
renderLocations();

window.addEventListener('beforeunload', () => {
    writeToLocalStorage(gameData);
});



