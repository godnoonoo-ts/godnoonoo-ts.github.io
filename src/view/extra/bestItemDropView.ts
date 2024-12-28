import { simIsRunning } from "../../controller/autoBattleController.js";
import { testDropItems } from "../../controller/extra/bestItemDrop.js";
import {
    clearHTMLChilds,
    clickingAnimation,
    convertMilliSecondsToTime,
    getHTMLElement,
    prettyNumber,
} from "../../utility.js";
import { currentExtraResults } from "./extrasView.js";

const BESTDROPRESULTS = getHTMLElement("#bestDropResults");
const ITEMS = getHTMLElement("#dropItems");
const CLEARING = getHTMLElement("#dropClearing");
const WR = getHTMLElement("#dropWR");
const INCOME = getHTMLElement("#dropIncome");

export function setupDropItem() {
    setupDropBtns();
}

function setupDropBtns() {
    const upgradeBtn = getHTMLElement("#bestItemDropBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            testDropItems();
        }
    });
}

export function uiSetDropsItems(items: string[]) {
    currentExtraResults.clear();
    currentExtraResults.add(clearDropItemsResults);
    // Make the UI visible
    BESTDROPRESULTS.style.display = "flex";

    // Add all items to the UI
    for (const item of items) {
        const nameSpan = document.createElement("span");
        nameSpan.innerHTML = item.replaceAll("_", " ");
        ITEMS.append(nameSpan);

        const clearingSpan = document.createElement("span");
        clearingSpan.innerHTML = "-";
        clearingSpan.id = `dropClearing${item}`;
        CLEARING.append(clearingSpan);

        const wrSpan = document.createElement("span");
        wrSpan.innerHTML = "-";
        wrSpan.id = `dropWR${item}`;
        WR.append(wrSpan);

        const incomeSpan = document.createElement("span");
        incomeSpan.innerHTML = "-";
        incomeSpan.id = `dropIncome${item}`;
        INCOME.append(incomeSpan);
    }
}

export function uiUpdateDropItem(
    item: string,
    time: number,
    wr: number,
    income: number,
) {
    const clearingSpan = getHTMLElement(`#dropClearing${item}`);
    if (time < 0) {
        time = Math.abs(time);
        clearingSpan.innerHTML = `-${convertMilliSecondsToTime(time)}`;
    } else clearingSpan.innerHTML = convertMilliSecondsToTime(time);

    const wrSpan = getHTMLElement(`#dropWR${item}`);
    if (wr < 0) {
        wr = Math.abs(wr);
        wrSpan.innerHTML = `-${prettyNumber(wr * 100)}%`;
    } else wrSpan.innerHTML = `${prettyNumber(wr * 100)}%`;

    const incomeSpan = getHTMLElement(`#dropIncome${item}`);
    incomeSpan.innerHTML = prettyNumber(income);
}

function clearDropItemsResults() {
    BESTDROPRESULTS.style.display = "none";
    clearHTMLChilds(ITEMS);
    clearHTMLChilds(CLEARING);
    clearHTMLChilds(WR);
    clearHTMLChilds(INCOME);
}
