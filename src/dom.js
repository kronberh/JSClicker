import { gameData, locSpecificUpgradesList } from "./script.js";

const volumeSlider = document.getElementById("sound-volume");

volumeSlider.addEventListener('input', () => {
    document.querySelector(`label[for='${volumeSlider.id}']`).innerHTML = `Sound volume: ${volumeSlider.value}%`;
});

export function renderLocationUpgrades(locData) {
    locData.upgrades.forEach((u,i) => {
        const li = document.createElement('li');
        li.id = u.selector;

        li.innerHTML = `<div class="item-container">
            <img src=${u.imageUrl}>
            <p>${u.name}</p>
        </div>`;

        const button = document.createElement('button');
        button.innerHTML = `${u.price}<img src="img/currency.svg" alt="coins">`;

        // const obj = {}
        // obj['a'] = {};
        // obj['a']['b'] = 123;
        // console.log(obj);

        const onClickCallback = () => {
            if(gameData.coinsAmount >= u.price){
                u.upgrade();
                console.log(locData.name, u.name)
                if(!gameData.upgradesPurchased[locData.name]){
                    gameData.upgradesPurchased[locData.name] = {};
                    gameData.upgradesPurchased[locData.name][u.name] = 1;
                }else{
                    if(!gameData.upgradesPurchased[locData.name][u.name]){
                        gameData.upgradesPurchased[locData.name][u.name] = 1;
                    }else{
                        gameData.upgradesPurchased[locData.name][u.name] = +1;
                    }
                }
                document.querySelector(`#${u.selector} .progress-container progress`).value = gameData.upgradesPurchased[locData.name][u.name];
                document.querySelector(`#${u.selector} .progress-container span`).innerHTML = `x${gameData.upgradesPurchased[locData.name][u.name]}`;

                console.log(gameData.upgradesPurchased[locData.name][u.name]);

                gameData.coinsAmount -= u.price;

                const sound = new Audio('audio/item_purchased.mp3');
                sound.volume = volumeSlider.value / 100;
                sound.play();
            }else{
                alert('You dont have enough coins to purchase this.');
            }
        };

        button.addEventListener('click', onClickCallback);
        li.querySelector('.item-container').appendChild(button);

        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        progressContainer.innerHTML = `<progress value="${(typeof gameData.upgradesPurchased.desert[u.name] === 'undefined') ? 0 : gameData.upgradesPurchased.desert[u.name]}" max="${u.max}"></progress>
        <span>${(typeof gameData.upgradesPurchased.desert[u.name] === 'undefined') ? '' : `x${gameData.upgradesPurchased.desert[u.name]}`}</span>`;
        gameData.callbacks.push(onClickCallback);
        li.appendChild(progressContainer);
        locSpecificUpgradesList.appendChild(li);
    });
}

export function removeLocationUpgrades() {
    const children = Array.from(locSpecificUpgradesList.children);

    children.forEach((child, index) => {
        const button = child.querySelector('button');
        if (button) {
            button.removeEventListener('click', gameData.callbacks[index]);
        }
        locSpecificUpgradesList.removeChild(child);
    });

    gameData.callbacks = [];
}