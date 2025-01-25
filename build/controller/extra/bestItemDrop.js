/*
Calculating the best item to remove from a build.
*/
import { displayBestItem, uiSetDropsItems, uiUpdateDropItem } from "../../view/extra/bestItemDropView.js";
import { getResults, modifiedAutoBattle, startSimulation } from "../autoBattleController.js";
import { equipItemBackendOnly } from "../itemEquipController.js";
import { getItemsToRun } from "./get.js";
export function testDropItems() {
    runAllItems();
}
function runAllItems() {
    STORAGE.itemsToRun = getItemsToRun(true, false);
    if (STORAGE.itemsToRun.length > 0) {
        STORAGE.bestWR = ["", 0];
        STORAGE.bestTime = ["", Infinity];
        STORAGE.bestIncome = ["", 0];
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
function getReducedWR(results) {
    return results.enemiesKilled / (results.enemiesKilled + results.trimpsKilled);
}
function onUpdate() {
    const results = getResults();
    uiUpdateDropItem(STORAGE.currentItem, results.clearingTime, getReducedWR(results), results.gameDust);
}
function onComplete() {
    setBestItem();
    equipItemBackendOnly(STORAGE.currentItem);
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    }
    else if (STORAGE.bestTime[0] !== "") {
        displayBestItem(STORAGE.bestTime[0], STORAGE.bestWR[0], STORAGE.bestIncome[0]);
    }
}
function setBestItem() {
    const results = getResults();
    if (results.clearingTime < STORAGE.bestTime[1]) {
        STORAGE.bestTime = [STORAGE.currentItem, results.clearingTime];
    }
    const reduced = getReducedWR(results);
    if (reduced > STORAGE.bestWR[1]) {
        STORAGE.bestWR = [STORAGE.currentItem, reduced];
    }
    if (results.gameDust > STORAGE.bestIncome[1]) {
        STORAGE.bestIncome = [STORAGE.currentItem, results.gameDust];
    }
}
const STORAGE = {
    itemsToRun: [],
    currentItem: "",
    bestWR: ["", 0],
    bestTime: ["", Infinity],
    bestIncome: ["", 0],
};
