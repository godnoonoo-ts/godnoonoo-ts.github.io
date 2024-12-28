/*
Bonuses view panel, used for setting and leveling bonuses.
This file should not interact directly with the data layer.
*/
import { getOneTimersSA, getPossibleRingMods, getMutations, equipOneTimer, equipMutation, equipScruffy, getRingStatAmt, equipRingMods, setRingLevel, } from "../controller/bonusesController.js";
import { addHover, capitaliseFirstLetter, getHTMLElement, prettyNumber, } from "../utility.js";
export function bonusesView() {
    setupOneTimerBtns();
    setupRingBtns();
    setupMutationsBtns();
}
function setupOneTimerBtns() {
    const oneTimersPanel = getHTMLElement("#oneTimersPanel");
    const oneTimers = getOneTimersSA();
    for (const key in oneTimers) {
        const button = document.createElement("button");
        button.innerHTML = key.replaceAll("_", " ");
        button.id = key + "_Button";
        button.classList.add("uncheckedButton", "text", "generalButton", "oneTimerButton");
        oneTimersPanel.appendChild(button);
        addChangeForOneTimerButton(button, key);
        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("hover", "bonusHover");
        const oneTimer = oneTimers[key];
        let description = oneTimer.description;
        description +=
            " Unlocks at " +
                (oneTimer.requiredItems - 4).toString() +
                " contracts.";
        descriptionDiv.innerHTML = description;
        button.appendChild(descriptionDiv);
        addHover(button, descriptionDiv);
    }
}
function addChangeForOneTimerButton(button, oneTimer) {
    button.addEventListener("click", () => {
        equipOneTimer(oneTimer);
    });
}
function setupRingBtns() {
    const ringMods = getPossibleRingMods();
    const ringModsDiv = getHTMLElement("#ringModsDiv");
    for (const [key, ringMod] of Object.entries(ringMods)) {
        const modButton = document.createElement("button");
        let name = key.replaceAll("_", " ");
        name = name.replace("Mult", "");
        name = capitaliseFirstLetter(name);
        modButton.innerHTML = name;
        modButton.id = key + "_Button";
        modButton.classList.add("uncheckedButton", "text", "generalButton");
        ringModsDiv.appendChild(modButton);
        const mod = [key];
        addChangeForRingButton(modButton, mod);
        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("hover", "ringHover");
        modButton.addEventListener("mouseover", () => {
            const stat = prettyNumber(getRingStatAmt(ringMod)).toString();
            const description = "+" +
                stat +
                (key === "lifesteal" || key === "dustMult" ? "%" : "");
            descriptionDiv.innerHTML = description;
        });
        modButton.appendChild(descriptionDiv);
        addHover(modButton, descriptionDiv);
    }
    const ringInput = getHTMLElement("#Ring_Input");
    addChangeForRingInput(ringInput);
}
function addChangeForRingButton(button, mod) {
    button.addEventListener("click", () => {
        equipRingMods(mod);
    });
}
function addChangeForRingInput(input) {
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        setRingLevel(value, true);
    });
}
function setupMutationsBtns() {
    const mutationsPanel = getHTMLElement("#mutationsPanel");
    const mutations = getMutations();
    for (const [key, mutation] of Object.entries(mutations)) {
        const button = document.createElement("button");
        button.innerHTML = mutation.dn.replaceAll("_", " ");
        button.id = key + "_Button";
        button.classList.add("uncheckedButton", "text", "generalButton", "mutationsButton");
        mutationsPanel.appendChild(button);
        const mutationName = key;
        addChangeForMutationButton(button, mutationName);
        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("hover", "mutationHover");
        descriptionDiv.innerHTML = mutation.description;
        button.appendChild(descriptionDiv);
        addHover(button, descriptionDiv);
    }
    // Move if needed.
    setupS21Btn(mutationsPanel);
}
function addChangeForMutationButton(button, mutation) {
    button.addEventListener("click", () => {
        equipMutation(mutation);
    });
}
function setupS21Btn(mutationsPanel) {
    const button = document.createElement("button");
    button.innerHTML = "S21";
    button.id = "S21_Button";
    button.classList.add("uncheckedButton", "text", "generalButton", "mutationsButton");
    mutationsPanel.appendChild(button);
    addChangeForScruffyButton(button);
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("hover", "mutationHover");
    descriptionDiv.innerHTML =
        "Scruffy teaches Huffy how to find 5x Dust from SA enemies.";
    button.appendChild(descriptionDiv);
    addHover(button, descriptionDiv);
}
function addChangeForScruffyButton(button) {
    button.addEventListener("click", () => {
        equipScruffy();
    });
}
