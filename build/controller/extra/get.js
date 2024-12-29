/*/
Provides functions for getting lists of items.
/*/
import { Trinary } from "../../utility.js";
import { getPossibleRingMods, getRing } from "../bonusesController.js";
import { getItemsInOrder } from "../itemEquipController.js";
import { getItem } from "../itemsController.js";
export function getItemsToRun(withDoppel, withRing) {
    let itemsToRun = [];
    const names = getItemsInOrder();
    for (const name of names) {
        const item = getItem(name);
        if (item.state === Trinary.Yes) {
            if (!withDoppel && name === "Doppelganger_Signet")
                continue;
            itemsToRun.push(name);
        }
    }
    if (!withRing)
        return itemsToRun;
    // Convert from keyof IABTypes["items"] to string[]
    let itemsWithRing = [];
    for (const item of itemsToRun)
        itemsWithRing.push(item);
    const ring = getRing();
    if (ring.bonus.owned) {
        itemsWithRing.push("Ring");
    }
    return itemsWithRing;
}
export function* permutations(array, length, start = 0) {
    if (start >= array.length || length < 1) {
        yield new Array();
    }
    else {
        while (start <= array.length - length) {
            let first = array[start];
            for (let subset of permutations(array, length - 1, start + 1)) {
                subset.push(first);
                yield subset;
            }
            ++start;
        }
    }
}
export function getModsToRun(count) {
    let modsToRun = [];
    const posMods = getPossibleRingMods();
    for (const mod in posMods)
        modsToRun.push(mod);
    return [...permutations(modsToRun, count)];
}
export function getOppositesLimit(items) {
    if (!items)
        items = getItemsToRun(true, false);
    const allItems = getItemsOwned();
    const opposites = [];
    for (const item of allItems) {
        if (!items.includes(item) && getItem(item).state === Trinary.No) {
            opposites.push(item);
        }
    }
    return opposites;
}
export function getHighestEquipped() {
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
export function getItemsOwned() {
    const highest = getHighestEquipped();
    const items = getItemsInOrder();
    const ownedItems = [];
    for (const item of items) {
        ownedItems.push(item);
        if (item === highest.name)
            break;
    }
    return ownedItems;
}
