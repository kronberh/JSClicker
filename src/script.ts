
class Game{
    public coinsAmount: number = 0;
    public coinsBonusPerClick: number = 1;
    public clickButton: HTMLButtonElement | null;
    public counter: HTMLParagraphElement | null

    public constructor(clickButtonSelector: string){
        this.coinsAmount = 0;
        this.clickButton = document.querySelector(clickButtonSelector);
        this.counter = document.querySelector('.current_coins');

        this.clickButton?.addEventListener('click', () => {
            this.incrementCoinsByAmount(this.coinsBonusPerClick);
        });
        
        (() => {
            setInterval(() => {
                this.incrementCoinsByAmount(1);
            }, 1000)
        })();

        (() => {
            this.coinsBonusPerClick = 100;
        })();
        
    }

    public incrementCoinsByAmount(value: number){
        if(this.counter){
            this.coinsAmount += value;
            this.counter.innerHTML = this.coinsAmount + '';
        }   
    }

    public setIntervalIncrement()
}

class Level{
    constructor(){
      
    }
}

interface Upgrade{
    boost(game: Game): void;
}

const game = new Game('.click_button');

