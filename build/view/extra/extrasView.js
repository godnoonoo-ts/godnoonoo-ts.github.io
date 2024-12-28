import { getHTMLElement } from "../../utility.js";
import { setupGrades } from "./bestGradesView.js";
import { setupAddItem } from "./bestItemAddView.js";
import { setupDropItem } from "./bestItemDropView.js";
import { setupBestMods } from "./bestRingModsView.js";
export function extrasView() {
    setWidth();
    setupGrades();
    setupBestMods();
    setupDropItem();
    setupAddItem();
}
export const currentExtraResults = {
    functions: [],
    clear() {
        if (this.functions.length > 0) {
            for (const func of this.functions) {
                func();
            }
        }
        this.functions = [];
    },
    add(func) {
        this.functions.push(func);
    },
};
function setWidth() {
    const simPanel = getHTMLElement("#simulationPanel");
    const calcPanel = getHTMLElement("#calcPanel");
    const calcResPanel = getHTMLElement("#calcResultsPanel");
    calcPanel.style.width = simPanel.offsetWidth + "px";
    calcResPanel.style.width = simPanel.offsetWidth + "px";
}
