import { resultsData } from "../data/simResultsData.js";

export function getSimResultsDps() {
    return resultsData.dustPerSecond;
}

export function setSimResultsDps(value: number) {
    resultsData.dustPerSecond = value;
}
