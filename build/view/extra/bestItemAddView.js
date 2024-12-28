import { simIsRunning } from "../../controller/autoBattleController.js";
import { testAddItems } from "../../controller/extra/bestItemAdd.js";
import { clearHTMLChilds, clickingAnimation, convertMilliSecondsToTime, getHTMLElement, prettyNumber, } from "../../utility.js";
import { currentExtraResults } from "./extrasView.js";
const BESTADDRESULTS = getHTMLElement("#bestAddResults");
const ITEMS = getHTMLElement("#addItems");
const CLEARING = getHTMLElement("#addClearing");
const WR = getHTMLElement("#addWR");
const INCOME = getHTMLElement("#addIncome");
export function setupAddItem() {
    setupAddBtns();
}
function setupAddBtns() {
    const upgradeBtn = getHTMLElement("#bestItemAddBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            testAddItems();
        }
    });
}
export function uiSetAddItems(items) {
    currentExtraResults.clear();
    currentExtraResults.add(clearAddItemsResults);
    // Make the UI visible
    BESTADDRESULTS.style.display = "flex";
    // Add all items to the UI
    for (const item of items) {
        const nameSpan = document.createElement("span");
        nameSpan.innerHTML = item.replaceAll("_", " ");
        ITEMS.append(nameSpan);
        const clearingSpan = document.createElement("span");
        clearingSpan.innerHTML = "-";
        clearingSpan.id = `addClearing${item}`;
        CLEARING.append(clearingSpan);
        const wrSpan = document.createElement("span");
        wrSpan.innerHTML = "-";
        wrSpan.id = `addWR${item}`;
        WR.append(wrSpan);
        const incomeSpan = document.createElement("span");
        incomeSpan.innerHTML = "-";
        incomeSpan.id = `addIncome${item}`;
        INCOME.append(incomeSpan);
    }
}
export function uiUpdateAddItem(item, time, wr, income) {
    const clearingSpan = getHTMLElement(`#addClearing${item}`);
    if (time < 0) {
        time = Math.abs(time);
        clearingSpan.innerHTML = `-${convertMilliSecondsToTime(time)}`;
    }
    else
        clearingSpan.innerHTML = convertMilliSecondsToTime(time);
    const wrSpan = getHTMLElement(`#addWR${item}`);
    if (wr < 0) {
        wr = Math.abs(wr);
        wrSpan.innerHTML = `-${prettyNumber(wr * 100)}%`;
    }
    else
        wrSpan.innerHTML = `${prettyNumber(wr * 100)}%`;
    const incomeSpan = getHTMLElement(`#addIncome${item}`);
    incomeSpan.innerHTML = prettyNumber(income);
}
function clearAddItemsResults() {
    BESTADDRESULTS.style.display = "none";
    clearHTMLChilds(ITEMS);
    clearHTMLChilds(CLEARING);
    clearHTMLChilds(WR);
    clearHTMLChilds(INCOME);
}
