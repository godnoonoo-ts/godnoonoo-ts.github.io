export let build = {
    // Initialise the build storage.
    items: {},
    oneTimers: {},
    ring: {
        level: 0,
        mods: [],
        dust_multiplier: 0,
    },

    // Methods to interact with the build.
    loadFromSave(data) {
        this.items = data.items;
        console.log(build);
        console.log(data);
    },

    loadFromImport(data) {},

    exportToBuildObject() {},

    loadFromSheet(data) {
        const itemLevels = data.split("\t");
        itemLevels.splice(0, 2);
        const autorunButton = document.querySelector("#autoRun");
        const wasAutorun = autorunButton.className === "checkedButton";
        if (wasAutorun) {
            autorunButton.click();
        }

        const equipInpDivs = document.querySelectorAll("div.equipInpDiv");
        for (let i = 0; i < equipInpDivs.length; i++) {
            const equipDiv = equipInpDivs[i];
            const [equipButton, equipInput] = equipDiv.childNodes;
            if (itemLevels[i]) {
                if (!/^\d+$/.test(itemLevels[i])) {
                    console.log(`time to bail at ${i} from '${itemLevels[i]}'`);
                    break;
                }

                if (equipButton.className === "uncheckedButton") {
                    equipButton.click();
                }
                equipInput.value = itemLevels[i];
            } else {
                if (equipButton.className === "checkedButton") {
                    equipButton.click();
                }
            }
        }

        document.querySelector("#startButton").click();
        if (wasAutorun) {
            autorunButton.click();
        }
    },
};

// //builds an object containing item levels from imported save data
// //playerObject input is used to control whether the object represents a player and all of their equipment levels (with unowned items having level = 0)
// //or an individual build (with unequipped items having level = 0)
// //an object representing a player can used to query the database for build suggestions
// //an object representing a build can sent to the controller to simulate it
// function createObjectFromSave(playerObject = 1){
//     let autoBattleData = save.global.autoBattleData
//     let obj = {
//                 items: {},
//                 oneTimers: {},
//                 rings: {level: 0, mods: {}},
//                 limbs: autoBattleData.bonuses.Extra_Limbs ? autoBattleData.bonuses.Extra_Limbs + 4 : 0, 
//                 level: playerObject ? autoBattleData.maxEnemyLevel : autoBattleData.enemyLevel
//                 // ,results: could also store results from simulation in object 
//             }
    
//     let items = orderByUnlock();
//     let current = {}

//     for(let item of items){
//         obj.items[item] = 0;

//         current = autoBattleData.items[item]
//         if(current)
//             if (playerObject || current.equipped)
//                 obj.items[item] = current.level
//     }

//     for (let oneTimer in AB.oneTimers)
//     {
//         if(oneTimer == "The_Ring")
//         {
//             obj.rings.level = autoBattleData.rings.level
//             obj.rings.mods = [...autoBattleData.rings.mods]
//         }
//         else
//             obj.oneTimers[oneTimer] = autoBattleData.oneTimers[oneTimer] ? 1 : 0

//     }

//     return obj

// }
