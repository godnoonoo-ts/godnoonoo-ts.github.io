/*
Controller for the levels, effects and resistance divs.
*/
import { builderData } from "../data/buildData.js";
import { autoBattle } from "../data/object.js";
import { updateInput } from "../utility.js";
import { updateEffects, updateLimbs } from "../view/levelsView.js";
import { getEnemyLevel, modifiedAutoBattle, modifiedAutoBattleWithBuild, } from "./autoBattleController.js";
export function getActiveEffects() {
    const level = getEnemyLevel();
    const effects = autoBattle.getEffects(level);
    if (effects === undefined) {
        return new Map();
    }
    return effects;
}
export function changeLimbs(item) {
    const increment = item.equipped ? 1 : -1;
    builderData.limbs += increment;
    updateLimbs();
}
export function getLimbs() {
    return builderData.limbs;
}
export function setEnemyLevel(level, frontendCall) {
    // Backend
    autoBattle.enemyLevel = level;
    // Frontend
    if (!frontendCall) {
        updateInput("currentEnemyLevel", level);
        updateEffects();
    }
    modifiedAutoBattleWithBuild();
}
export function setMaxEnemyLevel(level, frontendCall) {
    // Backend
    autoBattle.maxEnemyLevel = level;
    // Frontend
    if (!frontendCall) {
        updateInput("maxEnemyLevel", level);
    }
    modifiedAutoBattle();
}
export function checkMaxLevel(level) {
    const maxLevel = autoBattle.maxEnemyLevel;
    if (level > maxLevel) {
        setMaxEnemyLevel(level);
    }
}
