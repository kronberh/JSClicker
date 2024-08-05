import { upgradeData } from "./upgradeData.js";
import { renderLocationUpgrades, removeLocationUpgrades } from "./dom.js";

export const locSpecificUpgradesList = document.querySelector('#loc_specific');
export const counter = document.querySelector('.current_coins');

export const gameData = {
    coinsAmount: 0,
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

photoButton.addEventListener('click', () => {
    const svgString = new XMLSerializer().serializeToString(gameCanvas);
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = gameCanvas.width.baseVal.value;
        canvas.height = gameCanvas.height.baseVal.value;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
            const jpgUrl = URL.createObjectURL(blob);
            window.open(jpgUrl);
            URL.revokeObjectURL(url);
        }, 'image/jpeg');
    };
    img.src = url;
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

renderLocations();


