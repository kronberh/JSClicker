const locSpecificUpgradesList = document.querySelector('.log_specific');
const clickButton = document.querySelector('#clicker');
const counter = document.querySelector('.current_coins');

const gameData = {
    coinsAmount: 0,
    coinsBonusPerClick: 1,
    coinsPerSecond: 0,
    upgradesPurchased: {
        general: {

        },
        desert: {

        },
    }
};

clickButton.addEventListener('click', () => {
    gameData.coinsAmount += gameData.coinsBonusPerClick;
    counter.innerHTML = gameData.coinsAmount;
});

function incrementCoinsPerSecond(amount) {
    return () => {
        setInterval(() => {
            gameData.coinsAmount += amount;
            counter.innerHTML = gameData.coinsAmount;
        }, 1000);
    };
}

function initializeGame() {
    gamedata[0].upgrades.forEach(u => {
        const div = document.createElement('div');
        div.id = u.selector;

        const html = `<img src=${u.imageUrl}>
        <p>${u.name}</p>`;

        div.innerHTML = html;

        const onClickCallback = () => {
            u.upgrade();
            if(!gameData.upgradesPurchased.desert[u.name]){
                gameData.upgradesPurchased.desert[u.name] = 1;
            }else{
                gameData.upgradesPurchased.desert[u.name] += 1;
            }
            console.log(gameData.upgradesPurchased.desert);
        };

        div.addEventListener('click', onClickCallback);
        u.onClickCallback = onClickCallback;
        locSpecificUpgradesList.appendChild(div);
    });
}


const gamedata = [
    {
        name: 'desert',
        upgrades: [
            {
                name: 'Upgrade 5',
                price: 500,
                selector: 'upgrade5',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(5),
            },
            {
                name: 'Upgrade 6',
                price: 500,
                selector: 'upgrade6',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(6),
            },
            {
                name: 'Upgrade 7',
                price: 500,
                selector: 'upgrade7',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(7),
            },
            {
                name: 'Upgrade 8',
                price: 500,
                selector: 'upgrade8',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(8),
            },
        ]
    }
];

initializeGame();
