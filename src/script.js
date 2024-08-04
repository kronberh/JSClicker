const gameCanvas = document.querySelector('#gameCanvas');
const locSpecificUpgradesList = document.querySelector('#loc_specific');
const clickButton = document.querySelector('#clicker');
const photoButton = document.querySelector('#photo');
const counter = document.querySelector('.current_coins');

const gameData = {
    coinsAmount: 0,
    coinsBonusPerClick: 1,
    coinsPerSecond: 0,
    upgradesPurchased: {
        general: { },
        desert: { },
    }
};

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
        const li = document.createElement('li');
        li.id = u.selector;

        li.innerHTML = `<div class="item-container">
            <img src=${u.imageUrl}>
            <p>${u.name}</p>
        </div>`;

        const button = document.createElement('button');
        button.innerHTML = `${u.price}<img src="https://pngimg.com/d/coin_PNG36871.png" alt="coins">`;

        const onClickCallback = () => {
            u.upgrade();
            if(!gameData.upgradesPurchased.desert[u.name]){
                gameData.upgradesPurchased.desert[u.name] = 1;
            }else{
                gameData.upgradesPurchased.desert[u.name] += 1;
            }
            document.querySelector(`#${u.selector} .progress-container progress`).value = gameData.upgradesPurchased.desert[u.name];
            document.querySelector(`#${u.selector} .progress-container span`).innerHTML = `x${gameData.upgradesPurchased.desert[u.name]}`;
        };

        button.addEventListener('click', onClickCallback);
        li.querySelector('.item-container').appendChild(button);

        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        progressContainer.innerHTML = `<progress value="0" max="${u.max}"></progress>
        <span></span>`;
        
        li.appendChild(progressContainer);
        
        u.onClickCallback = onClickCallback; // что делает эта строка ?
        locSpecificUpgradesList.appendChild(li);
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
                max: 20,
            },
            {
                name: 'Upgrade 6',
                price: 1000,
                selector: 'upgrade6',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(6),
                max: 20,
            },
            {
                name: 'Upgrade 7',
                price: 2500,
                selector: 'upgrade7',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(7),
                max: 20,
            },
            {
                name: 'Upgrade 8',
                price: 5000,
                selector: 'upgrade8',
                imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/logo_google_adsense_color_2x_web_512dp.original.png',
                upgrade: incrementCoinsPerSecond(8),
                max: 20,
            },
        ]
    }
];

initializeGame();
