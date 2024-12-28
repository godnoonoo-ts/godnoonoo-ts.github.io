/*
Controls the existance of items.
All functions accessing items from autobattle should go through this file.
*/

import { Trinary } from "../utility.js";
import { Currency, IABTypes } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { Items } from "../data/items.js";

export class Item {
    name: keyof IABTypes["items"];
    currentState = Trinary.No;

    constructor(name: keyof IABTypes["items"]) {
        this.name = name;
    }

    get state(): Trinary {
        return this.currentState;
    }

    set state(state: Trinary) {
        this.currentState = state;
    }

    get equipped(): boolean {
        return autoBattle.items[this.name].equipped;
    }

    set equipped(equipped: boolean) {
        autoBattle.items[this.name].equipped = equipped;
    }

    get level(): number {
        return autoBattle.items[this.name].level;
    }

    set level(level: number) {
        autoBattle.items[this.name].level = level;
    }

    get startPrice(): number {
        const item = autoBattle.items[this.name];
        return "startPrice" in item ? item.startPrice : 5;
    }

    get priceMod(): number {
        const item = autoBattle.items[this.name];
        return "priceMod" in item ? item.priceMod : 3;
    }

    get price(): number {
        return autoBattle.contractPrice(this.name);
    }

    get object(): IABTypes["items"][keyof IABTypes["items"]] {
        return autoBattle.items[this.name];
    }

    get description(): string {
        return autoBattle.items[this.name].description();
    }

    get currency(): Currency.dust | Currency.shards {
        const item = autoBattle.items[this.name];
        if ("dustType" in item && item.dustType === "shards") {
            return Currency.shards;
        }
        return Currency.dust;
    }

    get zone(): number {
        const item = autoBattle.items[this.name];
        if ("zone" in item) {
            return item.zone;
        }
        return 0;
    }

    get upgradeText(): string | false {
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
        const name = key as keyof IABTypes["items"];
        const item = new Item(name);
        Items.push(item);
    }
}

export function getItem(item: keyof IABTypes["items"]): Item {
    // Find the item in the Items array which has the corresponding name
    return Items.find((itemObject) => itemObject.name === item) as Item;
}

export function getItems(): IABTypes["items"] {
    return autoBattle.items;
}
