export const builderData = {
    costItems: new Map(),
    costOneTimers: new Map(),
    costRing: 0,
    costDust: 0,
    costShard: 0,
    limbs: 0,
    clear() {
        this.costItems = new Map();
        this.costOneTimers = new Map();
        this.costRing = 0;
        this.costDust = 0;
        this.costShard = 0;
        this.limbs = 0;
    },
};
