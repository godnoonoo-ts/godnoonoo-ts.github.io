/*
Functions for calculating the best upgrade and best downgrade items.
*/

import { Currency, IABTypes } from "../../data/buildTypes.js";
import {
    uiSetGradesItems,
    uiUpdateGradeItem,
} from "../../view/extra/bestGradesView.js";
import {
    modifiedAutoBattle,
    startSimulation,
    getDustPs,
    getClearingTime,
} from "../autoBattleController.js";
import { incrementRing } from "../bonusesController.js";
import { getCurrency, getUpgradePrice } from "../general.js";
import { incrementItem } from "../itemEquipController.js";
import { getItemsToRun } from "./get.js";

const STORAGE = {
    increment: 0,
    itemsToRun: [] as string[],
    baseDustPs: 0,
    baseClearingTime: 0,
    currentItem: "",
};

export function findBestGrade(increment: number) {
    STORAGE.increment = increment;
    runAllItems();
}

function runAllItems() {
    STORAGE.itemsToRun = getItemsToRun(false, true);
    if (STORAGE.itemsToRun.length > 0) {
        modifiedAutoBattle();
        uiSetGradesItems(STORAGE.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}

function onUpdate() {
    const reducedTime = STORAGE.baseClearingTime - getClearingTime();

    let upgradeCost = 0;
    let currency = Currency.dust;
    if (STORAGE.increment > 0) {
        if (STORAGE.currentItem === "Ring") {
            upgradeCost = getUpgradePrice(
                STORAGE.currentItem,
                -STORAGE.increment,
            );
            currency = Currency.shards;
        } else {
            const item = STORAGE.currentItem as keyof IABTypes["items"];
            upgradeCost = getUpgradePrice(item, -STORAGE.increment);
            currency = getCurrency(item);
        }
    }

    const increaseDust =
        (getDustPs() - STORAGE.baseDustPs) /
        (currency === Currency.shards ? 1e9 : 1);
    const timeUntilProfit = upgradeCost / increaseDust;

    uiUpdateGradeItem(STORAGE.currentItem, reducedTime, timeUntilProfit);
}

function onComplete() {
    if (STORAGE.currentItem === "Ring") incrementRing(-STORAGE.increment);
    else
        incrementItem(
            STORAGE.currentItem as keyof IABTypes["items"],
            -STORAGE.increment,
        );
    const item = STORAGE.itemsToRun.shift();
    if (item !== undefined) {
        STORAGE.currentItem = item;
        simulateNextItem();
    }
}

function simulateNextItem() {
    if (STORAGE.currentItem === "Ring") {
        incrementRing(STORAGE.increment);
    } else {
        incrementItem(
            STORAGE.currentItem as keyof IABTypes["items"],
            STORAGE.increment,
        );
    }
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}

function baseOnComplete() {
    STORAGE.baseDustPs = getDustPs();
    STORAGE.baseClearingTime = getClearingTime();
    STORAGE.currentItem = STORAGE.itemsToRun.shift() as string;
    simulateNextItem();
}
