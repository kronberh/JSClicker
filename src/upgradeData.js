export const generalUpgradeData = [
        {
            name: 'Upgrade 1',
            price: 100,
            selector: `general-upgrade-1`,
            upgrade: incrementCoinsPerSecond(5),
            max: 20,
        },
        {
            name: 'Upgrade 2',
            price: 200,
            selector: `general-upgrade-2`,
            upgrade: incrementCoinsPerSecond(5),
            max: 20,
        },
        {
            name: 'Upgrade 3',
            price: 300,
            selector: `general-upgrade-3`,
            upgrade: incrementCoinsPerSecond(5),
            max: 20,
        },
        {
            name: 'Upgrade 4',
            price: 400,
            selector: `general-upgrade-4`,
            upgrade: incrementCoinsPerSecond(5),
            max: 20,
        },
]

import { gameData, counter } from "./script.js";

function incrementCoinsPerSecond(amount) {
    return () => {
        setInterval(() => {
            gameData.coinsAmount += amount;
            counter.innerHTML = gameData.coinsAmount;
        }, 1000);
    };
}