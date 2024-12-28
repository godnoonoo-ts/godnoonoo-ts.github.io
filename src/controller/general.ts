import { BuyableObjects, Currency, IABTypes } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import {
    getBonusPrice,
    getOneTimerPrice,
    getRingPrice,
} from "./bonusesController.js";
import { getItemPrice } from "./itemEquipController.js";
import { getItem } from "./itemsController.js";

export function getUpgradePrice(name: BuyableObjects, increment: number) {
    // Send in a negative number to get the price of the current level.
    const originalPrice = getPrice(name);
    const newPrice = getPrice(name, increment);
    return Math.abs(newPrice - originalPrice);
}

export function getPrice(name: BuyableObjects, increment?: number) {
    if (name === "The_Ring" || name === "Ring") {
        return getRingPrice(increment);
    }
    const itemKeys = Object.keys(autoBattle.items);
    if (itemKeys.includes(name)) {
        return getItemPrice(name as keyof IABTypes["items"], increment);
    }
    const oneTimerKeys = Object.keys(autoBattle.oneTimers);
    if (oneTimerKeys.includes(name)) {
        return getOneTimerPrice(name as keyof IABTypes["oneTimers"]);
    }
    if (
        name === "Extra_Limbs" ||
        name === "Radon" ||
        name === "Stats" ||
        name === "Scaffolding"
    ) {
        return getBonusPrice(name);
    }
    throw new Error("Object not implemented: " + name);
}

export function getCurrency(name: BuyableObjects) {
    if (name === "The_Ring" || name === "Ring") {
        return Currency.shards;
    }
    const itemKeys = Object.keys(autoBattle.items);
    if (itemKeys.includes(name)) {
        const item = getItem(name as keyof IABTypes["items"]);
        return item.currency;
    }
    const oneTimerKeys = Object.keys(autoBattle.oneTimers);
    if (oneTimerKeys.includes(name)) {
        return Currency.dust;
    }
    if (name === "Extra_Limbs" || name === "Radon" || name === "Stats") {
        return Currency.dust;
    }
    if (name === "Scaffolding") {
        return Currency.shards;
    }
    throw new Error("Object not implemented: " + name);
}
