import { prettify } from "./data/object.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function pick(obj: any, ...keys: any) {
    return Object.fromEntries(
        keys
            .filter((key: any) => key in obj)
            .map((key: any) => [key, obj[key]]),
    );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function capitaliseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowerFirstLetter(string: string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function updateButton(
    button: HTMLButtonElement | string,
    setUnselected?: boolean,
) {
    let classList;
    if (typeof button === "string") {
        classList = getHTMLElement("#" + button + "_Button").classList;
    } else {
        classList = button.classList;
    }

    if (setUnselected || classList.contains("checkedButton")) {
        classList.remove("checkedButton");
        classList.add("uncheckedButton");
    } else if (setUnselected && classList.contains("butButton")) {
        classList.remove("butButton");
        classList.add("uncheckedButton");
    } else {
        classList.remove("uncheckedButton");
        classList.add("checkedButton");
    }
}

export function updateTrinaryButton(button: HTMLButtonElement | string) {
    let classList;
    if (typeof button === "string") {
        classList = getHTMLElement("#" + button + "_Button").classList;
    } else {
        classList = button.classList;
    }
    if (classList.contains("checkedButton")) {
        classList.remove("checkedButton");
        classList.add("butButton");
    } else if (classList.contains("butButton")) {
        classList.remove("butButton");
        classList.add("uncheckedButton");
    } else {
        classList.remove("uncheckedButton");
        classList.add("checkedButton");
    }
}

export function updateInput(
    name: HTMLInputElement | string,
    level: number | string,
) {
    let input;
    if (typeof name === "string") {
        name = "#" + name + "_Input";
        input = getHTMLElement(name) as HTMLInputElement;
    } else {
        input = name;
    }
    input.value = level.toString();
}

export function clickingAnimation(button: HTMLElement) {
    button.addEventListener("click", () => {
        button.classList.remove("uncheckedButton");
        button.classList.add("checkedButton");
        setTimeout(() => {
            button.classList.remove("checkedButton");
            button.classList.add("uncheckedButton");
        }, 269);
    });
}

export function getHTMLElement(name: string): HTMLElement {
    const element = document.querySelector(name);
    if (!element) {
        if (!name.startsWith("#") && !name.startsWith(".")) {
            throw new Error(
                "Invalid selector. Please use a valid CSS selector.",
            );
        }
        throw new Error("Element not found: " + name);
    }
    return element as HTMLElement;
}

export function addHover(hoverDiv: HTMLElement, displayDiv: HTMLDivElement) {
    hoverDiv.addEventListener("mouseover", () => {
        showHover(displayDiv);
    });
    hoverDiv.addEventListener("focus", () => {
        showHover(displayDiv);
    });
    hoverDiv.addEventListener("mouseout", () => {
        hideHover(displayDiv);
    });
    hoverDiv.addEventListener("focusout", () => {
        hideHover(displayDiv);
    });
}

function showHover(element: HTMLElement) {
    element.style.display = "block";
}

function hideHover(element: HTMLElement) {
    element.style.display = "none";
}

export function prettyNumber(...number: number[]) {
    // Return all numbers in an array
    if (number.length > 1) {
        return number.map((num) => prettify(num));
    }
    return prettify(number);
}

export function convertSecondsToTime(seconds: number) {
    if (!isFinite(seconds)) return "♾️";

    // Seconds, minutes, hours, days and years
    const s = round(seconds % 60);
    const m = Math.floor(seconds / 60) % 60;
    const h = Math.floor(seconds / 3600) % 24;
    const d = Math.floor(seconds / 86400) % 365;
    const y = Math.floor(seconds / 31536000);
    // Return the time
    if (y > 0) return `${y}y` + (d > 0 ? ` ${d}d` : "");
    if (d > 0) return `${d}d` + (h > 0 ? ` ${h}h` : "");
    if (h > 0) return `${h}h` + (m > 0 ? ` ${m}m` : "");
    if (m > 0) return `${m}m` + (s > 0 ? ` ${s}s` : "");
    return `${round(seconds % 60, 1)}s`;
}

export function convertMilliSecondsToTime(ms: number) {
    return convertSecondsToTime(ms / 1000);
}

export function round(number: number, precision?: number) {
    if (precision === undefined) {
        return Math.round(number);
    }
    const factor = Math.pow(10, precision);
    return Math.round((number + Number.EPSILON) * factor) / factor;
}

export function clearHTMLChilds(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function average(list: number[]) {
    if (list.length) {
        return list.reduce((a, b) => a + b) / list.length;
    }
    return 0;
}

export type CallbackFunction = () => void;

export enum Trinary {
    Yes = "yes",
    No = "no",
    But = "but",
}

export function cycleTrinary(trinary: Trinary) {
    switch (trinary) {
        case Trinary.Yes:
            return Trinary.But;
        case Trinary.But:
            return Trinary.No;
        case Trinary.No:
            return Trinary.Yes;
    }
}

export function cycleTrinaryBool(trinary: Trinary) {
    switch (trinary) {
        case Trinary.Yes:
            return Trinary.No;
        case Trinary.But:
            return Trinary.No;
        case Trinary.No:
            return Trinary.Yes;
    }
}
