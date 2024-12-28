/* 
Controller for the autobattle simulation.
Should only be interacted with from the autoBattleController and index.
*/

import { autoBattle } from "../data/object.js";
import { CallbackFunction } from "../utility.js";

export const conConfig = {
    framesPerChunk: 200,
    onSimInterrupt: null as CallbackFunction | null,
    onSimComplete: null as CallbackFunction | null,
    onUpdate: null as CallbackFunction | null,
    baseRuntime: 1 * 60 * 60 * 1000, // 4 hours
    runtime: 0,
    updateInterval: 1000, // 1 second

    incRuntime() {
        this.runtime += this.baseRuntime;
    },

    setBaseRuntime(time: number) {
        this.baseRuntime = time;
    },

    resetFunctions() {
        this.onSimInterrupt = null;
        this.onSimComplete = null;
        this.onUpdate = null;
    },

    setOnUpdate(func: CallbackFunction) {
        this.onUpdate = func;
    },

    setOnComplete(func: CallbackFunction) {
        this.onSimComplete = func;
    },

    setOnInterrupt(func: CallbackFunction) {
        this.onSimInterrupt = func;
    },

    resetRuntime() {
        this.runtime = 0;
    },
};

export const gameController = {
    battleCount: 0,
    complete: false,
    interval: null as number | null, // Interval ID
    halt: false,
    resultBest: { enemy: 1, time: 0, win: false },
    resultCounter: { fights: 0, healthSum: 0, losses: 0 },
    modified: true,
    lastUpdate: Date.now(),

    getProgress() {
        const progress = autoBattle.lootAvg.counter / conConfig.runtime;
        return this.complete ? 1 : progress;
    },

    isRunning() {
        return this.interval != null;
    },

    resetStats() {
        autoBattle.resetAll();
        this.resultBest = { enemy: 1, time: 0, win: false };
        this.resultCounter = { fights: 0, healthSum: 0, losses: 0 };
    },

    start() {
        if (this.interval != null) {
            return; // Already running
        }
        if (this.modified) {
            this.resetStats();
            this.modified = false;
        }

        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
        this.complete = false;
        this.halt = false;
        gameController.lastUpdate = Date.now();
        this.interval = setInterval(this.loop, 0);
    },

    stop() {
        this.halt = true;
    },

    loop() {
        // Use gameController instead of "this" to reference the correct object.
        for (
            let frame = 0;
            !gameController.halt && frame < conConfig.framesPerChunk;
            ++frame
        ) {
            autoBattle.update();
            gameController.complete =
                autoBattle.lootAvg.counter >= conConfig.runtime;
            gameController.halt = gameController.complete;
        }
        if (gameController.halt && gameController.interval) {
            clearInterval(gameController.interval);
            gameController.interval = null;
        }

        if (gameController.shouldUpdate()) {
            if (conConfig.onUpdate) {
                conConfig.onUpdate();
            }
            if (gameController.halt) {
                if (gameController.complete && conConfig.onSimComplete) {
                    conConfig.onSimComplete();
                } else if (conConfig.onSimInterrupt) {
                    conConfig.onSimInterrupt();
                }
            }
        }
    },

    shouldUpdate() {
        if (gameController.halt) return true;
        const newUpdate = Date.now();
        if (newUpdate - conConfig.updateInterval > gameController.lastUpdate) {
            gameController.lastUpdate = newUpdate;
            return true;
        }
        return false;
    },

    battleSuccess() {
        ++this.resultCounter.fights;
        if (!this.resultBest.win) {
            this.resultBest.enemy = 0;
            this.resultBest.time = autoBattle.battleTime;
            this.resultBest.win = true;
        }
        if (this.resultBest.time > autoBattle.battleTime) {
            this.resultBest.time = autoBattle.battleTime;
        }
        this.battleCommon();
    },

    battleFailure() {
        ++this.resultCounter.fights;
        ++this.resultCounter.losses;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enemy = autoBattle.enemy as any;
        const enemyHealthPercentage = Math.max(
            0,
            Math.min(enemy.health / enemy.maxHealth, 1),
        );

        if (!this.resultBest.win) {
            if (enemyHealthPercentage < this.resultBest.enemy) {
                this.resultBest.enemy = enemyHealthPercentage;
                this.resultBest.time = autoBattle.battleTime;
            } else if (
                enemyHealthPercentage == this.resultBest.enemy &&
                autoBattle.battleTime > this.resultBest.time
            ) {
                this.resultBest.time = autoBattle.battleTime;
            }
        }
        this.resultCounter.healthSum += enemyHealthPercentage;
        this.battleCommon();
    },

    battleCommon() {
        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
    },
};

export function setupController() {
    autoBattle.onEnemyDied = gameController.battleSuccess.bind(gameController);
    autoBattle.onTrimpDied = gameController.battleFailure.bind(gameController);
}
