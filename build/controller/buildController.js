import { Currency } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { equipMutation, equipOneTimer, equipRingMods, equipScruffy, getOneTimersSA, getRingPrice, setRingLevel, unequipRingMods, } from "./bonusesController.js";
import { equipItem, levelItem } from "./itemEquipController.js";
import { u2Mutations } from "../data/mutations.js";
import { updatePresetButton } from "../view/simulationView.js";
import { getLimbs, setEnemyLevel, setMaxEnemyLevel, } from "./levelsController.js";
import { uiUpdateBuildCost, updateLimbs } from "../view/levelsView.js";
import { builderData } from "../data/buildData.js";
import { getSaveData } from "./saveController.js";
import { getCurrency, getPrice } from "./general.js";
import { Items } from "../data/items.js";
export function buildItems(items) {
    for (const [key, value] of Object.entries(items)) {
        const name = key;
        if (value.equipped) {
            equipItem(name, false, value.level);
        }
        else {
            levelItem(name, value.level);
        }
    }
}
export function buildFromSave() {
    const saveString = getSaveData();
    buildItems(saveString.items);
    // Set ring
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ringMods = saveString.ring.mods;
    setRingLevel(saveString.ring.level);
    equipRingMods(ringMods);
    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.keys(oneTimers).forEach((key) => {
        const name = key;
        equipOneTimer(name);
    });
    // Set mutations
    Object.keys(saveString.mutations).forEach((key) => {
        const name = key;
        if (name in u2Mutations.tree) {
            equipMutation(name);
        }
    });
    // Set S21
    equipScruffy(saveString.scruffy);
    // Set levels
    setEnemyLevel(saveString.currentLevel);
    setMaxEnemyLevel(saveString.maxEnemyLevel);
}
export function setPresets(presets) {
    const names = presets.names;
    autoBattle.presets.names = names;
    names.forEach((name, index) => {
        index += 1;
        const presetName = Object.keys(autoBattle.presets)[index];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preset = presets[presetName];
        if (preset.length > 0) {
            updatePresetButton(name, index);
            autoBattle.presets[presetName] = preset;
        }
    });
}
export function loadPreset(buttonName) {
    const r = /\d/;
    const id = Number(buttonName.match(r));
    const presetName = ("p" + id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preset = autoBattle.presets[presetName];
    const newItems = [];
    preset.forEach((row) => {
        if (typeof row === "object") {
            switch (row[0]) {
                case "level":
                    // TODO
                    break;
                case "ring": {
                    const ringMods = row.slice(1);
                    unequipRingMods();
                    equipRingMods(ringMods);
                }
            }
        }
        else {
            // Item
            newItems.push(row);
        }
    });
    for (const item of Items) {
        if (newItems.includes(item.name) !== item.equipped) {
            equipItem(item.name, false);
        }
    }
}
export function updateBuildCost() {
    const cost = calcBuildCost();
    uiUpdateBuildCost(cost[0], cost[1]);
}
function calcBuildCost() {
    let dustCost = 0;
    let shardCost = 0;
    // Price for items.
    for (const item of Items) {
        if (item.equipped) {
            const cost = getPrice(item.name);
            const currency = getCurrency(item.name);
            if (currency === Currency.shards) {
                shardCost += cost;
            }
            else if (currency === Currency.dust) {
                dustCost += cost;
            }
        }
    }
    // Price for one timers.
    const oneTimers = getOneTimersSA();
    for (const [name, value] of Object.entries(oneTimers)) {
        if (value.owned) {
            const cost = getPrice(name);
            if ("useShards" in value && value.useShards) {
                shardCost += cost;
            }
            else {
                dustCost += cost;
            }
        }
    }
    // Price for ring.
    shardCost += getRingPrice();
    // Price for extra limbs.
    const limbs = getLimbs();
    dustCost += limbs > 4 ? (100 * (Math.pow(100, limbs - 4) - 1)) / 99 : 0;
    return [dustCost, shardCost];
}
export function clearBuilderData() {
    builderData.clear();
    updateLimbs();
}
