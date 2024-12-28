/*
Controls equipping and leveling items.
Sends calls both to frontend and backend.
*/

import { IABTypes } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import {
    updateDescription,
    updateFrontendItem,
    updateItem,
} from "../view/itemsView.js";
import {
    Trinary,
    cycleTrinary,
    cycleTrinaryBool,
    updateInput,
} from "../utility.js";
import { changeLimbs } from "./levelsController.js";
import { modifiedAutoBattleWithBuild } from "./autoBattleController.js";
import { Item, getItem } from "./itemsController.js";
import { Items } from "../data/items.js";

export function equipItem(
    itemName: keyof IABTypes["items"],
    frontendCall: boolean,
    level?: number,
) {
    const item = getItem(itemName);
    if (frontendCall) {
        // Frontend
        item.state = cycleTrinary(item.state);
        if (item.state !== Trinary.But) {
            equipBackend(item);
        }
        updateFrontendItem(itemName);
    } else {
        // Backend
        equipItemBackendOnly(itemName, level);
        updateItem(itemName);
    }
}

function equipBackend(item: Item) {
    autoBattle.equip(item.name);
    changeLimbs(item);
    modifiedAutoBattleWithBuild();
}

export function equipItemBackendOnly(
    itemName: keyof IABTypes["items"],
    level?: number,
) {
    const item = getItem(itemName);
    item.state = cycleTrinaryBool(item.state);
    equipBackend(item);
    if (level) levelItem(itemName, level);
}

export function levelItem(
    itemName: keyof IABTypes["items"],
    level: number,
    frontendCall?: boolean,
) {
    // Backend
    const item = getItem(itemName);
    item.level = level;

    // Frontend
    updateDescription(itemName);
    if (!frontendCall) {
        updateInput(itemName, level);
    }

    modifiedAutoBattleWithBuild();
}

export function incrementItem(
    itemName: keyof IABTypes["items"],
    increment: number,
) {
    const item = getItem(itemName);
    item.level += increment;
}

export function getItemsInOrder(): (keyof IABTypes["items"])[] {
    /* Warning this is a copy of the items object, not a reference to it */
    const order = autoBattle.getItemOrder();

    const names: (keyof IABTypes["items"])[] = [];

    for (const item of order) {
        const name = item.name as keyof IABTypes["items"];
        names.push(name);
    }
    return names;
}

export function clearItems() {
    for (const item of Items) {
        item.equipped = false;
        item.level = 1;
        item.state = Trinary.No;
        updateItem(item.name, true);
        updateInput(item.name, 1);
    }
}

export function getItemPrice(
    name: keyof IABTypes["items"],
    increment?: number,
) {
    const item = getItem(name);
    let cost = isNaN(item.price) ? 0 : item.price;
    const level = increment ? item.level + increment : item.level;
    const start = item.startPrice;
    const mod = item.priceMod;
    cost += start * ((1 - Math.pow(mod, level - 1)) / (1 - mod));
    return cost;
}
