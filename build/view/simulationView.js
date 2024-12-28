/*
Simulation view panel, used for importing saves and starting the simulation.
This file should not interact directly with the data layer.
*/
import { buildFromSave, loadPreset } from "../controller/buildController.js";
import { clear, stringPaste } from "../controller/importController.js";
import { addHover, clickingAnimation, convertMilliSecondsToTime, getHTMLElement, prettyNumber, round, updateButton, } from "../utility.js";
import { getEnemyLevel, printAllInfo, setRuntime, startSimulationFromButton, stopSimulation, updateAutoRun, } from "../controller/autoBattleController.js";
export function simulationView() {
    setupImportBtns();
    setupPresetBtns();
    setupRunBtns();
    setupRuntimeInp();
    setupHover();
}
const testingEnabled = false; // Set true to enable testing.
function setupImportBtns() {
    const importInp = getHTMLElement("#saveImportInp");
    const hoverSpan = getHTMLElement("#importHover");
    addHover(importInp, hoverSpan);
    addImportAction(importInp);
    const resetBtn = getHTMLElement("#saveResetBtn");
    clickingAnimation(resetBtn);
    resetBtn.addEventListener("click", () => {
        clear(true);
        buildFromSave();
    });
}
function addImportAction(field) {
    field.addEventListener("paste", (event) => {
        const paste = event.clipboardData?.getData("text");
        if (paste) {
            stringPaste(paste);
        }
        field.blur();
    });
}
function setupPresetBtns() {
    for (let i = 1; i < 4; i++) {
        const presetButton = getHTMLElement("#Preset" + CSS.escape(i.toString()) + "_Button");
        clickingAnimation(presetButton);
        addPresetAction(presetButton);
    }
}
function addPresetAction(button) {
    button.addEventListener("click", () => {
        loadPreset(button.id);
    });
}
export function updatePresetButton(name, index) {
    const button = getHTMLElement("#Preset" + CSS.escape(index.toString()) + "_Button");
    button.innerText = name;
    button.hidden = false;
}
function setupRunBtns() {
    const startBtn = getHTMLElement("#start_Button");
    clickingAnimation(startBtn);
    setupStartBtn(startBtn);
    const stopBtn = getHTMLElement("#stop_Button");
    clickingAnimation(stopBtn);
    setupStopBtn(stopBtn);
    const autoRunBtn = getHTMLElement("#autoRun_Button");
    addChangeForAutoRun(autoRunBtn);
}
function addChangeForAutoRun(button) {
    button.addEventListener("click", () => {
        updateButton(button);
        updateAutoRun();
        if (testingEnabled) {
            printAllInfo();
        }
    });
}
function setupStartBtn(button) {
    button.addEventListener("click", () => {
        startSimulationFromButton();
    });
}
function setupStopBtn(button) {
    button.addEventListener("click", () => {
        stopSimulation();
    });
}
export function uiUpdateLiveResults(results) {
    updateTimeSpent(results.isRunning, results.timeUsed, results.runtime);
    updateKills(results.enemiesKilled, results.trimpsKilled);
    updateDustGains(results.gameDust, results.baseDust);
    updateClearingTimes(results.clearingTime, results.remainingTime);
    updateFightingTimes(results.fightTime, results.killTime);
    updateHealth(results.enemyHealth, results.enemyHealthLoss);
    updateBestFight(results.bestFight);
}
export function updateTimeSpent(isRunning, timeUsed, runtime) {
    const timeProcessedSpan = getHTMLElement("#timeProcessed");
    const finalTimeSpan = getHTMLElement("#finalTime");
    const isRunningSpan = getHTMLElement("#isRunning");
    if (isRunning) {
        timeProcessedSpan.innerHTML = convertMilliSecondsToTime(timeUsed);
        finalTimeSpan.innerHTML = convertMilliSecondsToTime(runtime);
        isRunningSpan.innerHTML = "/";
    }
    else {
        timeProcessedSpan.innerText = "";
        finalTimeSpan.innerHTML = "";
        isRunningSpan.innerHTML =
            "&#9208; / " + convertMilliSecondsToTime(runtime);
    }
}
function updateKills(enemiesKilled, trimpsKilled) {
    const enemiesKilledSpan = getHTMLElement("#enemiesKilled");
    const trimpsKilledSpan = getHTMLElement("#trimpsKilled");
    const winRateSpan = getHTMLElement("#winRate");
    enemiesKilledSpan.innerHTML = prettyNumber(enemiesKilled);
    trimpsKilledSpan.innerHTML = prettyNumber(trimpsKilled);
    winRateSpan.innerHTML = round((enemiesKilled / (enemiesKilled + trimpsKilled)) * 100, 2).toString();
}
function updateDustGains(gameDust, baseDust) {
    // Dust gains
    const gameDustSpan = getHTMLElement("#gameDust");
    const baseDustSpan = getHTMLElement("#baseDust");
    gameDustSpan.innerHTML = prettyNumber(gameDust);
    baseDustSpan.innerHTML = prettyNumber(baseDust);
    // Shards gains
    const shardsDustSpan = getHTMLElement("#shardsDust");
    const baseShardsSpan = getHTMLElement("#baseShards");
    const shards = getEnemyLevel() >= 51;
    shardsDustSpan.innerHTML = shards ? prettyNumber(gameDust / 1e9) : "0";
    baseShardsSpan.innerHTML = shards ? prettyNumber(baseDust / 1e9) : "0";
}
function updateClearingTimes(clearingTime, remainingTime) {
    const clearingTimeSpan = getHTMLElement("#clearingTime");
    const remainingTimeSpan = getHTMLElement("#remainingTime");
    clearingTimeSpan.innerHTML = convertMilliSecondsToTime(clearingTime);
    remainingTimeSpan.innerHTML = convertMilliSecondsToTime(remainingTime);
}
function updateHealth(enemyHealth, enemyHealthLoss) {
    const enemyHealthSpan = getHTMLElement("#enemyHealth");
    const enemyHealthLossSpan = getHTMLElement("#enemyHealthLoss");
    enemyHealthSpan.innerHTML = prettyNumber(enemyHealth);
    enemyHealthLossSpan.innerHTML = prettyNumber(enemyHealthLoss);
}
function updateBestFight(bestFight) {
    const bestFightSpan = getHTMLElement("#bestFight");
    bestFightSpan.innerHTML = bestFight;
}
function updateFightingTimes(fightTime, killTime) {
    const fightTimeSpan = getHTMLElement("#fightTime");
    const killTimeSpan = getHTMLElement("#killTime");
    fightTimeSpan.innerHTML = convertMilliSecondsToTime(fightTime);
    killTimeSpan.innerHTML = convertMilliSecondsToTime(killTime);
}
function setupRuntimeInp() {
    const runtimeInput = getHTMLElement("#runtimeInput");
    runtimeInput.addEventListener("input", () => {
        setRuntime(+runtimeInput.value);
    });
}
function setupHover() {
    baseHover();
}
function baseHover() {
    const baseDustHovered = getHTMLElement("#baseDustHovered");
    const baseDustHovering = getHTMLElement("#baseDustHovering");
    addHover(baseDustHovered, baseDustHovering);
    const shardsHovered = getHTMLElement("#baseShardsHovered");
    const shardsHovering = getHTMLElement("#baseShardsHovering");
    addHover(shardsHovered, shardsHovering);
}
