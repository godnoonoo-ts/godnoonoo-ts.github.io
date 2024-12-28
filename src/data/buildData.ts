import { IABTypes } from "./buildTypes.js";

export const builderData = {
    costItems: new Map<keyof IABTypes["items"], number>(),
    costOneTimers: new Map<keyof IABTypes["oneTimers"], number>(),
    costRing: 0,
    costDust: 0,
    costShard: 0,
    limbs: 0,

    clear() {
        this.costItems = new Map<keyof IABTypes["items"], number>();
        this.costOneTimers = new Map<keyof IABTypes["oneTimers"], number>();
        this.costRing = 0;
        this.costDust = 0;
        this.costShard = 0;
        this.limbs = 0;
    },
};
