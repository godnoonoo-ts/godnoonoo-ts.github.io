/*/
Provides functions for getting lists of items.
/*/

import { IABTypes } from "../../data/buildTypes.js";
import { Trinary } from "../../utility.js";
import { getPossibleRingMods, getRing } from "../bonusesController.js";
import { getItemsInOrder } from "../itemEquipController.js";
import { Item, getItem } from "../itemsController.js";

export function getItemsToRun(withDoppel: boolean, withRing: boolean) {
    const itemsToRun = [] as (keyof IABTypes["items"])[];
    const names = getItemsInOrder();
    for (const name of names) {
        const item = getItem(name);
        if (item.state === Trinary.Yes) {
            if (!withDoppel && name === "Doppelganger_Signet") continue;
            itemsToRun.push(name);
        }
    }
    if (!withRing) return itemsToRun;

    // Convert from keyof IABTypes["items"] to string[]
    const itemsWithRing = [] as string[];
    for (const item of itemsToRun) itemsWithRing.push(item);

    const ring = getRing();
    if (ring.bonus.owned) {
        itemsWithRing.push("Ring");
    }

    return itemsWithRing;
}

export function* permutations(array: string[], length: number, start = 0): Generator<Array<string>> {
    if (start >= array.length || length < 1) {
        yield [];
    } else {
        while (start <= array.length - length) {
            const first = array[start];
            for (const subset of permutations(array, length - 1, start + 1)) {
                subset.push(first);
                yield subset;
            }
            ++start;
        }
    }
}

export function getModsToRun(count: number) {
    const modsToRun: string[] = [];
    const posMods = getPossibleRingMods();
    for (const mod in posMods) modsToRun.push(mod);
    return [...permutations(modsToRun, count)];
}

export function getOppositesLimit(items?: (keyof IABTypes["items"])[]) {
    if (!items) items = getItemsToRun(true, false) as (keyof IABTypes["items"])[];
    const allItems = getItemsOwned();
    const opposites = [] as (keyof IABTypes["items"])[];
    for (const item of allItems) {
        if (!items.includes(item) && getItem(item).state === Trinary.No) {
            opposites.push(item);
        }
    }
    return opposites;
}

export function getHighestEquipped(): Item {
    const items = getItemsInOrder();
    let highestItem = getItem(items[6]);
    for (const item of items) {
        const currentItem = getItem(item);
        const state = currentItem.state;
        if (state === Trinary.Yes || state === Trinary.But) {
            highestItem = currentItem;
        }
    }
    return highestItem;
}

export function getItemsOwned(): (keyof IABTypes["items"])[] {
    const highest = getHighestEquipped();
    const items = getItemsInOrder();
    const ownedItems = [] as (keyof IABTypes["items"])[];
    for (const item of items) {
        ownedItems.push(item);
        if (item === highest.name) break;
    }
    return ownedItems;
}
