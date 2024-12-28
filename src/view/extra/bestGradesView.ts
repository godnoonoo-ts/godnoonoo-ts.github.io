import { simIsRunning } from "../../controller/autoBattleController.js";
import { findBestGrade } from "../../controller/extra/bestGrade.js";
import { getCurrency } from "../../controller/general.js";
import { Currency, IABTypes } from "../../data/buildTypes.js";
import {
    clearHTMLChilds,
    clickingAnimation,
    convertMilliSecondsToTime,
    convertSecondsToTime,
    getHTMLElement,
} from "../../utility.js";
import { currentExtraResults } from "./extrasView.js";

const BESTGRADESPANEL = getHTMLElement("#bestGradesResults");
const GRADESITEMSDUST = getHTMLElement("#gradesItemsDust");
const GRADESITEMSSHARDS = getHTMLElement("#gradesItemsShards");
const GRADESCLEARINGDUST = getHTMLElement("#gradesClearingDust");
const GRADESCLEARINGSHARDS = getHTMLElement("#gradesClearingShards");
const GRADESPROFITDUST = getHTMLElement("#gradesProfitDust");
const GRADESPROFITSHARDS = getHTMLElement("#gradesProfitShards");

export function setupGrades() {
    setupGradeBtns();
}

function setupGradeBtns() {
    const upgradeBtn = getHTMLElement("#bestGradesBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            const input = getHTMLElement(
                "#bestGradesInput",
            ) as HTMLInputElement;
            const increment = +input.value;
            findBestGrade(increment);
        }
    });
}

export function uiSetGradesItems(items: string[]) {
    currentExtraResults.clear();
    currentExtraResults.add(clearGradesResults);
    // Make the UI visible
    BESTGRADESPANEL.style.display = "flex";

    // Add all items to the UI
    for (const item of items) {
        const nameSpan = document.createElement("span");
        nameSpan.innerHTML = item.replaceAll("_", " ");
        const clearingSpan = document.createElement("span");
        clearingSpan.innerHTML = "-";
        clearingSpan.id = `gradesClearing${item}`;
        const profitSpan = document.createElement("span");
        profitSpan.innerHTML = "-";
        profitSpan.id = `gradesProfit${item}`;

        const currency = getCurrency(item as keyof IABTypes["items"]);
        if (currency === Currency.dust) {
            GRADESITEMSDUST.append(nameSpan);
            GRADESCLEARINGDUST.append(clearingSpan);
            GRADESPROFITDUST.append(profitSpan);
        } else if (currency === Currency.shards) {
            GRADESITEMSSHARDS.append(nameSpan);
            GRADESCLEARINGSHARDS.append(clearingSpan);
            GRADESPROFITSHARDS.append(profitSpan);
        }
    }
}

export function uiUpdateGradeItem(
    item: string,
    reducedTime: number,
    timeUntilProfit: number,
) {
    const clearingSpan = getHTMLElement(`#gradesClearing${item}`);
    if (reducedTime < 0) {
        reducedTime = Math.abs(reducedTime);
        clearingSpan.innerHTML = `-${convertMilliSecondsToTime(reducedTime)}`;
    } else clearingSpan.innerHTML = convertMilliSecondsToTime(reducedTime);

    const profitSpan = getHTMLElement(`#gradesProfit${item}`);
    if (timeUntilProfit < 0)
        profitSpan.innerHTML = convertMilliSecondsToTime(Infinity);
    else profitSpan.innerHTML = convertSecondsToTime(timeUntilProfit);
}

function clearGradesResults() {
    BESTGRADESPANEL.style.display = "none";
    clearHTMLChilds(GRADESITEMSDUST);
    clearHTMLChilds(GRADESITEMSSHARDS);
    clearHTMLChilds(GRADESCLEARINGDUST);
    clearHTMLChilds(GRADESCLEARINGSHARDS);
    clearHTMLChilds(GRADESPROFITDUST);
    clearHTMLChilds(GRADESPROFITSHARDS);
}
