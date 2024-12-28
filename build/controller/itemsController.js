/*
Controls the existance of items.
All functions accessing items from autobattle should go through this file.
*/
import { Trinary } from "../utility.js";
import { Currency } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { Items } from "../data/items.js";
export class Item {
    name;
    currentState = Trinary.No;
    constructor(name) {
        this.name = name;
    }
    get state() {
        return this.currentState;
    }
    set state(state) {
        this.currentState = state;
    }
    get equipped() {
        return autoBattle.items[this.name].equipped;
    }
    set equipped(equipped) {
        autoBattle.items[this.name].equipped = equipped;
    }
    get level() {
        return autoBattle.items[this.name].level;
    }
    set level(level) {
        autoBattle.items[this.name].level = level;
    }
    get startPrice() {
        const item = autoBattle.items[this.name];
        return "startPrice" in item ? item.startPrice : 5;
    }
    get priceMod() {
        const item = autoBattle.items[this.name];
        return "priceMod" in item ? item.priceMod : 3;
    }
    get price() {
        return autoBattle.contractPrice(this.name);
    }
    get object() {
        return autoBattle.items[this.name];
    }
    get description() {
        return autoBattle.items[this.name].description();
    }
    get currency() {
        const item = autoBattle.items[this.name];
        if ("dustType" in item && item.dustType === "shards") {
            return Currency.shards;
        }
        return Currency.dust;
    }
    get zone() {
        const item = autoBattle.items[this.name];
        if ("zone" in item) {
            return item.zone;
        }
        return 0;
    }
    get upgradeText() {
        const item = autoBattle.items[this.name];
        if ("upgrade" in item) {
            return item.upgrade;
        }
        return false;
    }
}
export function initialiseItems() {
    createItems();
}
export function createItems() {
    // For each of the items in autobattle, create an item object
    const items = autoBattle.items;
    for (const key of Object.keys(items)) {
        const name = key;
        const item = new Item(name);
        Items.push(item);
    }
}
export function getItem(item) {
    // Find the item in the Items array which has the corresponding name
    return Items.find((itemObject) => itemObject.name === item);
}
export function getItems() {
    return autoBattle.items;
}
