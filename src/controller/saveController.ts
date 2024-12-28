import { IABTypes } from "../data/buildTypes.js";
import { saveData } from "../data/saveData.js";

export function getSaveData() {
    return saveData as IABTypes;
}

export function setSaveData(data: IABTypes) {
    Object.assign(saveData, data);
}

export function getRemainingEnemies() {
    return saveData.remainingEnemies as number;
}

export function getTotalDust() {
    return saveData.dust as number;
}

export function getTotalShards() {
    return saveData.shards as number;
}
