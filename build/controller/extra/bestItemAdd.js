/*
Calculating the best item to add to a build.
*/
import { uiSetAddItems, uiUpdateAddItem, } from "../../view/extra/bestItemAddView.js";
import { getResults, modifiedAutoBattle, startSimulation, } from "../autoBattleController.js";
import { equipItemBackendOnly } from "../itemEquipController.js";
import { getOppositesLimit } from "./get.js";
const STORAGE = {
    itemsToRun: [],
    currentItem: "",
};
export function testAddItems() {
    runAllItems();
}
function runAllItems() {
    STORAGE.itemsToRun = getOppositesLimit();
    if (STORAGE.itemsToRun.length > 0) {
        modifiedAutoBattle();
        uiSetAddItems(STORAGE.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}
function simulateNextItem() {
    equipItemBackendOnly(STORAGE.currentItem);
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}
function baseOnComplete() {
    STORAGE.currentItem = STORAGE.itemsToRun.shift();
    simulateNextItem();
}
function onUpdate() {
    const results = getResults();
    const reducedWR = results.enemiesKilled / (results.enemiesKilled + results.trimpsKilled);
    uiUpdateAddItem(STORAGE.currentItem, results.clearingTime, reducedWR, results.gameDust);
}
function onComplete() {
    equipItemBackendOnly(STORAGE.currentItem);
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    }
}
