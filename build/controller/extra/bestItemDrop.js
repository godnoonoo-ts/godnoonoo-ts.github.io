/*
Calculating the best item to remove from a build.
*/
import { uiSetDropsItems, uiUpdateDropItem, } from "../../view/extra/bestItemDropView.js";
import { getResults, modifiedAutoBattle, startSimulation, } from "../autoBattleController.js";
import { equipItemBackendOnly } from "../itemEquipController.js";
import { getItemsToRun } from "./get.js";
const STORAGE = {
    itemsToRun: [],
    currentItem: "",
};
export function testDropItems() {
    runAllItems();
}
function runAllItems() {
    STORAGE.itemsToRun = getItemsToRun(true, false);
    if (STORAGE.itemsToRun.length > 0) {
        modifiedAutoBattle();
        uiSetDropsItems(STORAGE.itemsToRun);
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
    uiUpdateDropItem(STORAGE.currentItem, results.clearingTime, reducedWR, results.gameDust);
}
function onComplete() {
    equipItemBackendOnly(STORAGE.currentItem);
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    }
}
