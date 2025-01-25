/*
Functions for calculating best ring mods.
*/

import { IRing } from "../../data/buildTypes.js";
import { displayBestMods, uiSetMods, uiUpdateMod } from "../../view/extra/bestRingModsView.js";
import { getKillTime, getDustPs, modifiedAutoBattle, startSimulation } from "../autoBattleController.js";
import { equipRingMods, getRing, unequipRingMods } from "../bonusesController.js";
import { getModsToRun } from "./get.js";

export function findBestMod() {
    const ring = getRing().stats as IRing;
    ORIGINALMODS = ring.mods as unknown as string | string[];

    const lvl = ring.level;
    if (lvl < 5) return; // No mods
    if (lvl < 15) {
        MODSTORUN = getModsToRun(1);
    } else if (lvl < 30) {
        MODSTORUN = getModsToRun(2);
    } else {
        MODSTORUN = getModsToRun(3);
    }
    uiSetMods(MODSTORUN);
    CURRENTMODS = MODSTORUN.shift() as string[];
    BESTMODSDPS = [CURRENTMODS, 0];
    BESTMODSTIME = [CURRENTMODS, Infinity];
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

    updateBestMods(killTime, dustPs);
    uiUpdateMod(listMods(CURRENTMODS), killTime, dustPs);
}

function onComplete() {
    const mod = MODSTORUN.shift() as string[];
    if (mod !== undefined) {
        CURRENTMODS = mod;
        simulateNextMod();
    } else {
        unequipRingMods();
        equipRingMods(listMods(ORIGINALMODS));
        displayBestMods(BESTMODSDPS[0], BESTMODSTIME[0]);
    }
}

function listMods(mod: string | string[]) {
    if (Array.isArray(mod)) return mod;
    return [mod];
}

function updateBestMods(killTime: number, dustPs: number) {
    if (killTime < BESTMODSTIME[1]) {
        BESTMODSTIME = [CURRENTMODS, killTime];
    }

    if (dustPs > BESTMODSDPS[1]) {
        BESTMODSDPS = [CURRENTMODS, dustPs];
    }
}

let MODSTORUN: string[][] = [];
let CURRENTMODS: string[];
let ORIGINALMODS: string | string[];
let BESTMODSDPS: [string[], number];
let BESTMODSTIME: [string[], number];
