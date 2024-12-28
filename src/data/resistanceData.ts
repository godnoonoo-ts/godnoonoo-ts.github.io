export interface IEnemy {
    bleed: number;
    poison: number;
    shock: number;
    resistBleed: number;
    resistPoison: number;
    resistShock: number;
    shank: number;
    shankedEffect: "poison" | "bleed" | "shock" | "none";
}

export interface IHuffy {
    bleedMin: number;
    bleedMax: number;
    canBleed: boolean;
    poisonMin: number;
    poisonMax: number;
    canPoison: boolean;
    shockMin: number;
    shockMax: number;
    canShock: boolean;
    resistAll: number;
    resistBleed: number;
    resistPoison: number;
    resistShock: number;
    warningAegis: boolean;
    shankedEffect: "poison" | "bleed" | "shock" | "none";
}

export interface IShank {
    bleed: number[];
    poison: number[];
    shock: number[];
    reductionMin: number;
    reductionMax: number;
    shanked: boolean;
}

export const enemy: IEnemy = {
    bleed: 0,
    poison: 0,
    shock: 0,
    resistBleed: 0,
    resistPoison: 0,
    resistShock: 0,
    shank: 0,
    shankedEffect: "none",
};

export const huffy: IHuffy = {
    bleedMin: 0,
    bleedMax: 0,
    canBleed: false,
    canPoison: false,
    canShock: false,
    poisonMax: 0,
    poisonMin: 0,
    resistAll: 0,
    resistBleed: 0,
    resistPoison: 0,
    resistShock: 0,
    shockMax: 0,
    shockMin: 0,
    warningAegis: false,
    shankedEffect: "none",
};

export const shankInfo: IShank = {
    bleed: [0, 0],
    poison: [0, 0],
    reductionMax: 0,
    reductionMin: Infinity,
    shanked: false,
    shock: [0, 0],
};
