/*
Handles UI display of best ring mods calculations.
*/

import { simIsRunning } from "../../controller/autoBattleController.js";
import { findBestMod } from "../../controller/extra/bestRingMods.js";
import {
    capitaliseFirstLetter,
    clearHTMLChilds,
    clickingAnimation,
    convertMilliSecondsToTime,
    getHTMLElement,
    prettyNumber,
} from "../../utility.js";
import { currentExtraResults } from "./extrasView.js";

const BESTMODSPANEL = getHTMLElement("#bestModsResults");
const MODSMODS = getHTMLElement("#modsMods");
const KILLTIME = getHTMLElement("#modsKillTime");
const DUSTPS = getHTMLElement("#modsDustPs");

export function setupBestMods() {
    setupModsBtn();
}

function setupModsBtn() {
    const upgradeBtn = getHTMLElement("#bestRingModsBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            findBestMod();
        }
    });
}

export function uiSetMods(mods: (string | string[])[]) {
    currentExtraResults.clear();
    currentExtraResults.add(clearModsResults);

    // Make the UI visible
    BESTMODSPANEL.style.display = "flex";

    // Add all mods to the UI

    for (const item of mods) {
        const [mod, name] = getModName(item);
        const modSpan = document.createElement("span");
        modSpan.innerHTML = name;
        const killTimeSpan = document.createElement("span");
        killTimeSpan.innerHTML = "-";
        killTimeSpan.id = `modsKill${mod}`;
        const dustPsSpan = document.createElement("span");
        dustPsSpan.innerHTML = "-";
        dustPsSpan.id = `modsDustPs${mod}`;

        MODSMODS.append(modSpan);
        KILLTIME.append(killTimeSpan);
        DUSTPS.append(dustPsSpan);
    }
}

function getModName(mods: string | string[]) {
    if (typeof mods === "string") {
        let name = mods.replace("Mult", "");
        name = capitaliseFirstLetter(name);
        const mod = mods.replaceAll("_", " ");
        return [mod, name];
    } else {
        let name1 = mods[0].replace("Mult", "");
        name1 = capitaliseFirstLetter(name1);
        let name2 = mods[1].replace("Mult", "");
        name2 = capitaliseFirstLetter(name2);
        const name = `${name1} & ${name2}`;
        const mod = `${mods[0]}_${mods[1]}`;
        return [mod, name];
    }
}

export function uiUpdateMod(
    mod: string | string[],
    killTime: number,
    dustPs: number,
) {
    // if mod is an array, it's a combined mod
    if (Array.isArray(mod)) {
        mod = mod.join("_");
    }
    const killTimeSpan = getHTMLElement(`#modsKill${mod}`);
    killTimeSpan.innerHTML = convertMilliSecondsToTime(killTime);

    const dustPsSpan = getHTMLElement(`#modsDustPs${mod}`);
    dustPsSpan.innerHTML = prettyNumber(dustPs);
}

function clearModsResults() {
    BESTMODSPANEL.style.display = "none";
    clearHTMLChilds(MODSMODS);
    clearHTMLChilds(KILLTIME);
    clearHTMLChilds(DUSTPS);
}
