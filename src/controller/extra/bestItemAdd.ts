/*
Calculating the best item to add to a build.
*/

import { IABTypes } from "../../data/buildTypes.js";
import { displayBestItem, uiSetAddItems, uiUpdateAddItem } from "../../view/extra/bestItemAddView.js";
import { getResults, IResults, modifiedAutoBattle, startSimulation } from "../autoBattleController.js";
import { equipItemBackendOnly } from "../itemEquipController.js";
import { getOppositesLimit } from "./get.js";

export function testAddItems() {
    runAllItems();
}

function runAllItems() {
    STORAGE.itemsToRun = getOppositesLimit();
    if (STORAGE.itemsToRun.length > 0) {
        STORAGE.bestWR = ["", 0];
        STORAGE.bestTime = ["", Infinity];
        STORAGE.bestIncome = ["", 0];
        modifiedAutoBattle();
        uiSetAddItems(STORAGE.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}

function simulateNextItem() {
    equipItemBackendOnly(STORAGE.currentItem as keyof IABTypes["items"]);
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}

function baseOnComplete() {
    STORAGE.currentItem = STORAGE.itemsToRun.shift() as string;
    simulateNextItem();
}

function getReducedWR(results: IResults) {
    return results.enemiesKilled / (results.enemiesKilled + results.trimpsKilled);
}

function onUpdate() {
    const results = getResults();
    uiUpdateAddItem(STORAGE.currentItem, results.clearingTime, getReducedWR(results), results.gameDust);
}

function onComplete() {
    setBestItem();

    equipItemBackendOnly(STORAGE.currentItem as keyof IABTypes["items"]);
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    } else if (STORAGE.bestTime[0] !== "") {
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
    itemsToRun: [] as string[],
    currentItem: "",
    bestWR: ["", 0] as [string, number],
    bestTime: ["", Infinity] as [string, number],
    bestIncome: ["", 0] as [string, number],
};
