/*
Functions for calculating best ring mods.
*/
import { uiSetMods, uiUpdateMod } from "../../view/extra/bestRingModsView.js";
import { getKillTime, getDustPs, modifiedAutoBattle, startSimulation, } from "../autoBattleController.js";
import { equipRingMods, getRing, unequipRingMods, } from "../bonusesController.js";
import { getModsToRun } from "./get.js";
let MODSTORUN = [];
let CURRENTMODS;
let ORIGINALMODS;
export function findBestMod() {
    const ring = getRing().stats;
    ORIGINALMODS = ring.mods;
    const lvl = ring.level;
    if (lvl < 5)
        return; // No mods
    if (lvl < 15) {
        MODSTORUN = getModsToRun(1);
    }
    else {
        MODSTORUN = getModsToRun(2);
    }
    uiSetMods(MODSTORUN);
    CURRENTMODS = MODSTORUN.shift();
    simulateNextMod();
}
function simulateNextMod() {
    unequipRingMods();
    const mod = listMods(CURRENTMODS);
    equipRingMods(mod);
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}
function onUpdate() {
    const killTime = getKillTime();
    const dustPs = getDustPs();
    uiUpdateMod(listMods(CURRENTMODS), killTime, dustPs);
}
function onComplete() {
    const mod = MODSTORUN.shift();
    if (mod !== undefined) {
        CURRENTMODS = mod;
        simulateNextMod();
    }
    else {
        unequipRingMods();
        equipRingMods(listMods(ORIGINALMODS));
    }
}
function listMods(mod) {
    if (Array.isArray(mod))
        return mod;
    return [mod];
}
