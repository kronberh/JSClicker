import { upgradeData } from "./locSpecificUpgradeData.js";

const localStorageKey = "gameData";

export function writeToLocalStorage(data){
    localStorage.setItem(localStorageKey, JSON.stringify(data));
}

export function fetchLocalStorage(){
    return JSON.parse(localStorage.getItem(localStorageKey));
}

// upgradesPurchased: {
//     locationName: {
//         upgradeName: amount,
//         upgradeName: amount,
//         ...
//     }
//     ...
// }

export function initializeFromGameConfig(data){
    const upgradesPurchased = data.upgradesPurchased;
    if(upgradesPurchased){
        for(const upgradeLocationName in upgradesPurchased){
            if(upgradeLocationName !== 'general'){
                const locationInfo = upgradeData.find(i => i.name === upgradeLocationName);

                const locationPurchasedUpgrades = upgradesPurchased[upgradeLocationName];

                for(const upgradeName in locationPurchasedUpgrades){
                    // console.log(upgradeName, ' bought ', locationPurchasedUpgrades[upgradeName], 'times');
                    
                    const upgradeConfigInformation = locationInfo.upgrades.find(u => u.name === upgradeName);

                    if(upgradeConfigInformation){
                        for(let i = 0; i < locationPurchasedUpgrades[upgradeName]; i++){
                            upgradeConfigInformation.upgrade();
                        }
                    }  
                }
            }   
        }
    }
}