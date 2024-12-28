import { BuyableObjects, Currency } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { getCurrency, getPrice } from "./general.js";
import { getSimResultsDps } from "./resultsController.js";
import { getTotalDust, getTotalShards } from "./saveController.js";

export function timeToAfford(item: BuyableObjects, level: number) {
    let price = 0;
    price += getPrice(item, level);
    const itemsKeys = Object.keys(autoBattle.items);
    if (item === "The_Ring" || itemsKeys.includes(item)) {
        price -= getPrice(item, 0);
    }
    let dps = getSimResultsDps();
    let asset: number;

    const currency = getCurrency(item);
    if (currency === Currency.shards) {
        dps /= 1e9;
        asset = getTotalShards();
    } else {
        asset = getTotalDust();
    }

    const fromSave = (price - asset) / dps;
    const fromScratch = price / dps;
    return {
        fromSave,
        fromScratch,
    };
}
