/*
Functions for calculating the best upgrade and best downgrade items.
*/
import { Currency } from "../../data/buildTypes.js";
import { displayBestItem, uiSetGradesItems, uiUpdateGradeItem } from "../../view/extra/bestGradesView.js";
import { modifiedAutoBattle, startSimulation, getDustPs, getClearingTime } from "../autoBattleController.js";
import { incrementRing } from "../bonusesController.js";
import { getCurrency, getUpgradePrice } from "../general.js";
import { incrementItem } from "../itemEquipController.js";
import { getItemsToRun } from "./get.js";
export function findBestGrade(increment) {
    STORAGE.increment = increment;
    runAllItems();
}
function runAllItems() {
    STORAGE.itemsToRun = getItemsToRun(false, true);
    if (STORAGE.itemsToRun.length > 0) {
        STORAGE.bestTime = ["", -Infinity];
        STORAGE.bestProfit = ["", Infinity];
        modifiedAutoBattle();
        uiSetGradesItems(STORAGE.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}
function getReducedTime() {
    return STORAGE.baseClearingTime - getClearingTime();
}
function getTimeUntilProfit() {
    let upgradeCost = 0;
    let currency = Currency.dust;
    if (STORAGE.increment > 0) {
        if (STORAGE.currentItem === "Ring") {
            upgradeCost = getUpgradePrice(STORAGE.currentItem, -STORAGE.increment);
            currency = Currency.shards;
        }
        else {
            const item = STORAGE.currentItem;
            upgradeCost = getUpgradePrice(item, -STORAGE.increment);
            currency = getCurrency(item);
        }
    }
    const increaseDust = (getDustPs() - STORAGE.baseDustPs) / (currency === Currency.shards ? 1e9 : 1);
    return upgradeCost / increaseDust;
}
function onUpdate() {
    uiUpdateGradeItem(STORAGE.currentItem, getReducedTime(), getTimeUntilProfit());
}
function onComplete() {
    setBestItem();
    if (STORAGE.currentItem === "Ring")
        incrementRing(-STORAGE.increment);
    else
        incrementItem(STORAGE.currentItem, -STORAGE.increment);
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    }
    else if (STORAGE.increment >= 1) {
        displayBestItem(STORAGE.bestTime[0], STORAGE.bestProfit[0]);
    }
}
function simulateNextItem() {
    if (STORAGE.currentItem === "Ring") {
        incrementRing(STORAGE.increment);
    }
    else {
        incrementItem(STORAGE.currentItem, STORAGE.increment);
    }
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}
function baseOnComplete() {
    STORAGE.baseDustPs = getDustPs();
    STORAGE.baseClearingTime = getClearingTime();
    STORAGE.currentItem = STORAGE.itemsToRun.shift();
    simulateNextItem();
}
function setBestItem() {
    const reduced = getReducedTime();
    if (reduced > STORAGE.bestTime[1]) {
        STORAGE.bestTime = [STORAGE.currentItem, reduced];
    }
    let profit = getTimeUntilProfit();
    if (profit < 0)
        profit = Infinity;
    if (profit < STORAGE.bestProfit[1]) {
        STORAGE.bestProfit = [STORAGE.currentItem, profit];
    }
}
const STORAGE = {
    increment: 0,
    itemsToRun: [],
    baseDustPs: 0,
    baseClearingTime: 0,
    currentItem: "",
    bestTime: ["", -Infinity],
    bestProfit: ["", Infinity],
};
