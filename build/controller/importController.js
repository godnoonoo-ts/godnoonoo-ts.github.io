/*
Controls buttons and fields for importing and exporting data.
*/
import { Build } from "../data/buildTypes.js";
import { LZString } from "./lz-string.js";
import { buildFromSave, buildItems, clearBuilderData, setPresets, } from "./buildController.js";
import { clearItems } from "./itemEquipController.js";
import { clearBonuses, clearExtras, equipOneTimer, equipRingMod, getOneTimersSAName, setBonuses, setRingLevel, } from "./bonusesController.js";
import { enemyCount, modifiedAutoBattleWithBuild, startSimulationFromButton, } from "./autoBattleController.js";
import { setSaveData } from "./saveController.js";
import { getItems } from "./itemsController.js";
export function stringPaste(paste) {
    clear(false);
    let savegame;
    try {
        // Wtf do you think the try catch is for you stupid linter
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        savegame = JSON.parse(LZString.decompressFromBase64(paste));
    }
    catch (error) {
        // Do nothing
    }
    if (savegame) {
        //  Import save
        if (savegame.global) {
            importSave(savegame);
        }
        else {
            alert("https://nsheetz.github.io/perks/");
        }
    }
    else if (paste.includes("\t")) {
        // Import spreadsheet line
        importSpreadsheet(paste);
    }
    startSimulationFromButton();
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importSave(savegame) {
    clear(true);
    modifiedAutoBattleWithBuild();
    const saveString = {};
    const abData = savegame.global.autoBattleData;
    saveString.items = abData.items;
    const ring = {
        mods: abData.rings.mods,
        level: abData.rings.level,
    };
    if (!("The_Ring" in abData.oneTimers)) {
        // Set ring to unowned through 0 if it isn't owned
        ring.level = 0;
    }
    saveString.ring = ring;
    saveString.oneTimers = abData.oneTimers;
    saveString.mutations = savegame.global.u2MutationData;
    saveString.scruffy = savegame.global.fluffyExp2;
    saveString.currentLevel = abData.enemyLevel;
    saveString.maxEnemyLevel = abData.maxEnemyLevel;
    let remainingEnemies = 0;
    if (saveString.currentLevel === saveString.maxEnemyLevel) {
        remainingEnemies = enemyCount(abData.enemyLevel) - abData.enemiesKilled;
    }
    saveString.remainingEnemies = remainingEnemies;
    saveString.dust = abData.dust;
    saveString.shards = abData.shards;
    setSaveData(saveString);
    setBonuses(abData.bonuses);
    buildFromSave();
    const presets = savegame.global.autoBattleData.presets;
    setPresets(presets);
}
function importSpreadsheet(row) {
    modifiedAutoBattleWithBuild();
    const ABItems = JSON.parse(JSON.stringify(getItems())); // Deep copy
    const itemsList = cleanRow(row);
    let split = findBonusesSplit(itemsList);
    if (split === -1) {
        split = Object.keys(ABItems).length;
    }
    const items = itemsList.slice(0, split);
    const remaining = itemsList.slice(split);
    equipRowItems(ABItems, items);
    equipRowBonuses(remaining);
}
function cleanRow(row) {
    let rowSplit = row.split("\t");
    rowSplit = removeStringFirst(rowSplit);
    rowSplit = removeTrailing(rowSplit);
    return rowSplit;
}
function removeStringFirst(row) {
    // If the first non-tab character is a string, aka name, remove everything before and including it.
    for (let i = 0; i < row.length; i++) {
        if (row[i] !== "") {
            if (isNaN(parseInt(row[i])))
                return row.slice(i + 1);
            else
                return row;
        }
    }
    return row;
}
function removeTrailing(row) {
    // Remove everything from the WR (which has percentage) and after.
    for (let i = 0; i < row.length; i++) {
        if (row[i].includes("%")) {
            return row.slice(0, i);
        }
    }
    return row;
}
function findBonusesSplit(row) {
    for (let i = 0; i < row.length; i++) {
        if (row[i].includes("X")) {
            return i;
        }
    }
    return -1;
}
function equipRowItems(ABItems, items) {
    items.forEach((itemLevel, index) => {
        if (itemLevel !== "") {
            const itemName = Object.keys(Build.items)[index];
            ABItems[itemName].equipped = true;
            ABItems[itemName].level = parseInt(itemLevel);
        }
    });
    buildItems(ABItems);
}
function equipRowBonuses(bonuses) {
    if (!isNaN(parseInt(bonuses[0]))) {
        // The first bonus is the ring so equip all oneTimers
        equipOneTimer("Master_of_Arms");
        equipOneTimer("Dusty_Tome");
        equipOneTimer("Whirlwind_of_Arms");
    }
    bonuses.forEach((bonus, pos) => {
        if (bonus !== "") {
            equipBonus(bonus, pos);
        }
    });
}
function equipBonus(value, position) {
    const oneTimers = getOneTimersSAName();
    if (value === "X")
        equipOneTimer(oneTimers[position]);
    else {
        // Ring
        const lvl = parseInt(value);
        if (!isNaN(lvl))
            setRingLevel(lvl);
        else
            equipRingMod(value);
    }
}
export function clear(extras) {
    clearItems();
    clearBonuses();
    if (extras)
        clearExtras();
    clearBuilderData();
}
