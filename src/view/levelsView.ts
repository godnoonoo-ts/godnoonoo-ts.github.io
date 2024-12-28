/*
Levels view panel, used for setting levels and displaying relevant information.
This file should not interact directly with the data layer.
*/

import { getOneTimersSA, getUnlocks } from "../controller/bonusesController.js";
import { getCurrency } from "../controller/general.js";
import { getItemsInOrder } from "../controller/itemEquipController.js";
import { getItem } from "../controller/itemsController.js";
import {
    checkMaxLevel,
    getActiveEffects,
    getLimbs,
    setEnemyLevel,
    setMaxEnemyLevel,
} from "../controller/levelsController.js";
import { timeToAfford } from "../controller/moreInfoController.js";
import { BuyableObjects, Currency } from "../data/buildTypes.js";
import { IEnemy, IHuffy, IShank } from "../data/resistanceData.js";
import {
    capitaliseFirstLetter,
    clickingAnimation,
    convertSecondsToTime,
    getHTMLElement,
    prettyNumber,
    round,
} from "../utility.js";

export function levelsView() {
    setWidth();
    setupMaxLevelInput();
    setupEnemyLevelInput();
    updateEffects();
    setupTimeAfford();
}

function setWidth() {
    const bonusesPanel = getHTMLElement("#bonusesPanel");
    const levelsPanel = getHTMLElement("#infoPanel");
    const moreInfoPanel = getHTMLElement("#moreInfoPanel");
    levelsPanel.style.width = bonusesPanel.offsetWidth + "px";
    moreInfoPanel.style.width = bonusesPanel.offsetWidth + "px";
}

function setupMaxLevelInput() {
    const input = getHTMLElement("#maxEnemyLevel_Input") as HTMLInputElement;
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        setMaxEnemyLevel(value, true);
    });
}

function setupEnemyLevelInput() {
    const input = getHTMLElement(
        "#currentEnemyLevel_Input",
    ) as HTMLInputElement;
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        setEnemyLevel(value, true);
        checkMaxLevel(value);
        updateEffects();
    });
}

export function updateLimbs() {
    const limbsDiv = getHTMLElement("#limbsUsed");
    limbsDiv.innerHTML = getLimbs().toString();
}

export function updateEffects() {
    const effectsDiv = getHTMLElement("#effectsDiv");
    const effects = getActiveEffects();
    let effectsString = "";
    const effectsIter = effects.entries();
    for (let i = 0; i < effects.size; ++i) {
        const [effect, multiplier] = effectsIter.next().value;
        if (multiplier === 1) {
            effectsString += capitaliseFirstLetter(effect);
        } else {
            effectsString += capitaliseFirstLetter(effect) + " x" + multiplier;
        }
        if (i < effects.size - 1) {
            effectsString += ", ";
        }
    }
    effectsDiv.innerHTML = effectsString;
}

export function updateShank(
    shankInfo: IShank,
    huffyShanked: string,
    enemyShanked: string,
) {
    const huffyDiv = getHTMLElement("#huffyShank");
    if (shankInfo.shanked) {
        huffyDiv.children[0].innerHTML = capitaliseFirstLetter(huffyShanked);
        huffyDiv.hidden = false;
    } else {
        huffyDiv.hidden = true;
    }

    const enemyDiv = getHTMLElement("#enemyShank");
    if (shankInfo.shanked) {
        enemyDiv.children[0].innerHTML = capitaliseFirstLetter(enemyShanked);
        enemyDiv.hidden = false;
    } else {
        enemyDiv.hidden = true;
    }
}

export function uiUpdateResistances(enemy: IEnemy) {
    const poisonResistSpan = getHTMLElement("#enemyPoisonResist");
    const bleedResistSpan = getHTMLElement("#enemyBleedResist");
    const shockResistSpan = getHTMLElement("#enemyShockResist");
    const poisonResist = enemy.resistPoison;
    let bleedResist: number;
    let shockResist: number;

    if (getItem("Stormbringer").equipped) {
        bleedResist = enemy.resistBleed + enemy.resistShock;
        shockResist = 0;
    } else {
        bleedResist = enemy.resistBleed;
        shockResist = enemy.resistShock;
    }

    poisonResistSpan.innerHTML = poisonResist.toString();
    bleedResistSpan.innerHTML = bleedResist.toString();
    shockResistSpan.innerHTML = shockResist.toString();
}

export function uiUpdateChances(
    huffy: IHuffy,
    enemy: IEnemy,
    shankInfo: IShank,
) {
    // Huffy chances
    let hfPoisonChance: number[] = [];
    let hfBleedChance: number[] = [];
    let hfShockChance: number[] = [];

    // Enemy chances
    let enPoisonChance: number[] = [];
    let enBleedChance: number[] = [];
    let enShockChance: number[] = [];

    const hfPoisonChanceSpan = getHTMLElement("#huffyPoisonChance");
    const hfBleedChanceSpan = getHTMLElement("#huffyBleedChance");
    const hfShockChanceSpan = getHTMLElement("#huffyShockChance");

    const enPoisonChanceSpan = getHTMLElement("#enemyPoisonChance");
    const enBleedChanceSpan = getHTMLElement("#enemyBleedChance");
    const enShockChanceSpan = getHTMLElement("#enemyShockChance");

    // Correct values when Stormbringer is equipped, want to do somewhere else optimally.
    if (getItem("Stormbringer").equipped) {
        const res = enemy.resistShock;
        enemy.resistShock = 0;
        enemy.resistBleed += res;
    }

    const shank = getItem("Sacrificial_Shank");

    if (shank.equipped) {
        const resistAllMax =
            huffy.resistAll +
            Math.floor((shankInfo.reductionMax + enemy.shank) / 10) *
                shank.level;
        const resistAllMin =
            huffy.resistAll +
            Math.floor((shankInfo.reductionMin + enemy.shank) / 10) *
                shank.level;

        // Enemy poison chance
        enPoisonChance.push(
            enemy.poison -
                resistAllMin -
                huffy.resistPoison -
                (enemy.shankedEffect === "poison" ? enemy.shank : 0),
        );

        if (resistAllMax !== resistAllMin) {
            enPoisonChance.push(
                enemy.poison -
                    resistAllMax -
                    huffy.resistPoison -
                    (enemy.shankedEffect === "poison" ? enemy.shank : 0),
            );
        }

        // Enemy bleed chance
        enBleedChance.push(
            enemy.bleed -
                resistAllMin -
                huffy.resistBleed -
                (enemy.shankedEffect === "bleed" ? enemy.shank : 0),
        );
        if (resistAllMax !== resistAllMin) {
            enBleedChance.push(
                enemy.bleed -
                    resistAllMax -
                    huffy.resistBleed -
                    (enemy.shankedEffect === "bleed" ? enemy.shank : 0),
            );
        }

        // Enemy shock chance
        enShockChance.push(
            enemy.shock -
                resistAllMin -
                huffy.resistShock -
                (enemy.shankedEffect === "shock" ? enemy.shank : 0),
        );
        if (resistAllMax !== resistAllMin) {
            enShockChance.push(
                enemy.shock -
                    resistAllMax -
                    huffy.resistShock -
                    (enemy.shankedEffect === "shock" ? enemy.shank : 0),
            );
        }

        // Huffy poison chance
        hfPoisonChance.push(shankInfo.poison[0] - enemy.resistPoison);
        if (shankInfo.poison[0] !== shankInfo.poison[1]) {
            hfPoisonChance.push(shankInfo.poison[1] - enemy.resistPoison);
        }

        // Huffy bleed chance
        hfBleedChance.push(shankInfo.bleed[0] - enemy.resistBleed);
        if (shankInfo.bleed[0] !== shankInfo.bleed[1]) {
            hfBleedChance.push(shankInfo.bleed[1] - enemy.resistBleed);
        }

        // Huffy shock chance
        hfShockChance.push(shankInfo.shock[0] - enemy.resistShock);
        if (shankInfo.shock[0] !== shankInfo.shock[1]) {
            hfShockChance.push(shankInfo.shock[1] - enemy.resistShock);
        }
    } else {
        // Enemy poison chance
        enPoisonChance.push(
            enemy.poison - huffy.resistAll - huffy.resistPoison,
        );

        // Enemy bleed chance
        enBleedChance.push(enemy.bleed - huffy.resistAll - huffy.resistBleed);

        // Enemy shock chance
        enShockChance.push(enemy.shock - huffy.resistAll - huffy.resistShock);

        // Huffy poison chance
        hfPoisonChance.push(huffy.poisonMin - enemy.resistPoison);
        if (huffy.poisonMin !== huffy.poisonMax) {
            hfPoisonChance.push(huffy.poisonMax - enemy.resistPoison);
        }

        // Huffy bleed chance
        hfBleedChance.push(huffy.bleedMin - enemy.resistBleed);
        if (huffy.bleedMin !== huffy.bleedMax) {
            hfBleedChance.push(huffy.bleedMax - enemy.resistBleed);
        }

        // Huffy shock chance
        hfShockChance.push(huffy.shockMin - enemy.resistShock);
        if (huffy.shockMin !== huffy.shockMax) {
            hfShockChance.push(huffy.shockMax - enemy.resistShock);
        }
    }

    hfPoisonChance = hfPoisonChance.map((x) => round(x));
    hfBleedChance = hfBleedChance.map((x) => round(x));
    hfShockChance = hfShockChance.map((x) => round(x));
    hfPoisonChanceSpan.innerHTML = hfPoisonChance.join("% to ");
    hfBleedChanceSpan.innerHTML = hfBleedChance.join("% to ");
    hfShockChanceSpan.innerHTML = hfShockChance.join("% to ");

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    hfPoisonChanceSpan.parentElement!.hidden = !huffy.canPoison;
    hfBleedChanceSpan.parentElement!.hidden = !huffy.canBleed;
    hfShockChanceSpan.parentElement!.hidden = !huffy.canShock;

    enPoisonChance = enPoisonChance.map((x) => round(x));
    enBleedChance = enBleedChance.map((x) => round(x));
    enShockChance = enShockChance.map((x) => round(x));
    enPoisonChanceSpan.innerHTML = enPoisonChance.join("% to ");
    enBleedChanceSpan.innerHTML = enBleedChance.join("% to ");
    enShockChanceSpan.innerHTML = enShockChance.join("% to ");
    enPoisonChanceSpan.parentElement!.hidden = enemy.poison <= 0;
    enBleedChanceSpan.parentElement!.hidden = enemy.bleed <= 0;
    enShockChanceSpan.parentElement!.hidden = enemy.shock <= 0;
    /* eslint-enable @typescript-eslint/no-non-null-assertion*/
}

export function uiUpdateBuildCost(dust: number, shards: number) {
    const dustSpan = getHTMLElement("#dustCost");
    const shardsSpan = getHTMLElement("#shardsCost");

    dustSpan.innerHTML = prettyNumber(dust);
    shardsSpan.innerHTML = prettyNumber(shards);
}

function setupTimeAfford() {
    setupTimeAffordBtn();
    setupTimeAffordSelect();
}

function setupTimeAffordBtn() {
    const btn = getHTMLElement("#timeAffordBtn");
    const input = getHTMLElement("#timeAffordLevels") as HTMLInputElement;
    const select = getHTMLElement("#timeAffordSelect") as HTMLSelectElement;
    const timeDiv = getHTMLElement("#timeAffordTime");
    const fromSaveSpan = getHTMLElement("#timeAffordFromSave");
    const fromScratchSpan = getHTMLElement("#timeAffordFromScratch");

    btn.addEventListener("click", () => {
        const item = select.selectedOptions[0].value;
        const levels = +input.value;
        const time = timeToAfford(item as BuyableObjects, levels);

        timeDiv.style.display = "flex";
        if (time.fromSave < 0) {
            fromSaveSpan.innerHTML = "now!";
        } else {
            fromSaveSpan.innerHTML =
                "in: " + convertSecondsToTime(time.fromSave);
        }
        fromScratchSpan.innerHTML = convertSecondsToTime(time.fromScratch);
    });

    clickingAnimation(btn);
}

function setupTimeAffordSelect() {
    const select = getHTMLElement("#timeAffordSelect") as HTMLSelectElement;
    // Change background colour based on selected item
    select.addEventListener("change", (event) => {
        select.classList.remove(select.classList[1]);
        const target = event.target as HTMLSelectElement;
        const colour = target.options[target.selectedIndex].classList;
        select.classList.add(colour[0]);
    });

    // Add items options
    const names = getItemsInOrder();
    let option;
    for (const name of names) {
        if (name === "Doppelganger_Signet") {
            continue;
        }
        option = document.createElement("option");
        option.value = name;
        option.innerHTML = name.replaceAll("_", " ");
        select.append(option);

        const currency = getCurrency(name);
        if (currency === Currency.shards) {
            option.classList.add("shardsColour");
        } else if (currency === Currency.dust) {
            option.classList.add("dustColour");
        }
    }

    // Add ring option
    option = document.createElement("option");
    option.value = "The_Ring";
    option.innerHTML = "The Ring";
    option.classList.add("theRingColour");
    select.append(option);

    // Add one timers
    for (const oneTimer in getOneTimersSA()) {
        option = document.createElement("option");
        option.value = oneTimer;
        option.innerHTML = oneTimer.replaceAll("_", " ");
        option.classList.add("oneTimerColour");
        select.append(option);
    }
    option = document.createElement("option");
    option.value = "Unlock_The_Ring";
    option.innerHTML = "Unlock the Ring";
    option.classList.add("oneTimerColour");
    select.append(option);

    // Add unlocks options
    for (const bonus in getUnlocks()) {
        option = document.createElement("option");
        option.value = bonus;
        option.innerHTML = bonus.replaceAll("_", " ");
        option.classList.add("unlockColour");
        select.append(option);
    }
}
