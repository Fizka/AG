import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

export enum SelectionTypes {
  BEST_SELECTION = 'BEST',
  ROULETTE_SELECTION = 'ROULETTE',
  TOURNAMENT_SELECTION = 'TOURNAMENT',
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() {
  }

  private static getProcent(population, procent): number {
    return Math.round(population * (procent) / 100);
  }

  private static getRandomInt(indexMin, indexMax): number {
    indexMin = Math.ceil(indexMin);
    indexMax = Math.floor(indexMax);
    return Math.floor(Math.random() * (indexMax - indexMin)) + indexMin;
  }

  private static getRandom(indexMin, indexMax): number {
    indexMin = Math.ceil(indexMin);
    indexMax = Math.floor(indexMax);
    return Math.random() * (indexMax - indexMin) + indexMin;
  }

  performSelection(population: Subject[], parameter: number, maximization: boolean, selectionType: SelectionTypes, popLen): Subject[] {
    let nextPopulation: Subject[];
    switch (selectionType) {
      case SelectionTypes.BEST_SELECTION: {
        nextPopulation = this.selectionBest(population, parameter, maximization);
        break;
      }
      case SelectionTypes.ROULETTE_SELECTION: {
        nextPopulation = this.selectionRoulette(population, parameter, popLen);
        break;
      }
      case SelectionTypes.TOURNAMENT_SELECTION: {
        nextPopulation = this.selectionTournament(population, parameter, maximization);
        break;
      }
    }
    return nextPopulation;
  }

  public selectionBest(population: Subject[], percent: number, findMax: boolean): Subject[] {
    const sub = population;
    findMax ? sub.sort((a, b) => b.fitnessValue - a.fitnessValue)
      : sub.sort((a, b) => a.fitnessValue - b.fitnessValue);
    sub.splice(SelectionService.getProcent(sub.length, percent));
    return sub;
  }

  public selectionRoulettess(population: Subject[], howMuch): Subject[] {
    const sub = population;
    const poolIndex = this.getPoolIndex(0, population.length - 1, SelectionService.getProcent(population.length, howMuch));
    const gg = [];
    for (let f = 0; f < poolIndex.length; f++) {
      gg.push(sub[poolIndex[f]]);
    }
    return gg;
  }

  public selectionRoulette(population: Subject[], howMuch, popLen): Subject[] {
    const sub = population;
    const gg: Mark[] = [];
    let score: Subject[] = [];
    let sum = 0;
    sub.forEach(p => {
      sum += p.fitnessValue;
    });
    let last = 0;
    population.forEach(p => {
      const mark: Mark = new Mark();
      mark.mark = p.fitnessValue / sum;
      mark.sub = p;
      mark.start = last;
      mark.stop = last + mark.mark;
      last += mark.mark;
      if (mark !== undefined) {
        gg.push(mark);
      }
    });
    if (howMuch <= 50) {
      const rI = Math.random();
      const value = gg.findIndex(p => p.start <= rI && p.stop > rI);
      if (gg[value].sub !== undefined && value !== undefined) {
        score = Array.of(gg[value].sub);
      }
      while (score.length < SelectionService.getProcent(popLen, howMuch)) {
        const randomIndex = Math.random();
        const val = gg.findIndex(p => p.start <= randomIndex && p.stop > randomIndex);
        if (val !== undefined) {
          if (score.findIndex(d => gg[val].sub.x === d.x && gg[val].sub.y === d.y) === -1) {
            if (gg[val].sub !== undefined) {
              score.push(gg[val].sub);
            }
          }
        }
      }
    } else {
      while (sub.length !== SelectionService.getProcent(popLen, howMuch)) {
        const randomIndex = Math.random();
        const val = gg.findIndex(p => p.start <= randomIndex && p.stop > randomIndex);
        if (val !== undefined) {
          const popindex = sub.findIndex(d => gg[val].sub.x === d.x && gg[val].sub.y === d.y);
          if (popindex !== -1) {
            sub.splice(popindex, 1);
          }
        }
      }
    }
    score.pop();
    return howMuch > 50 ? sub : score;
  }

  private getPoolIndex(indexMin, indexMax, howMuch): number[] {
    const poolIndex = [];
    poolIndex.push(SelectionService.getRandom(indexMin, indexMax));
    while (poolIndex.length < howMuch) {
      const randomIndex = SelectionService.getRandom(indexMin, indexMax);
      if (poolIndex.indexOf(randomIndex) === -1) {
        poolIndex.push(randomIndex);
      }
    }
    return poolIndex;
  }

  public selectionTournament(population: Subject[], numberOfSections, max): Subject[] {
    const result: Subject[] = [];
    const l = population.length;
    const presentNumber = Math.round(population.length / numberOfSections);
    if (l < numberOfSections) {
      result.push(this.findBest(this.findSet(population, 0, l), max));
    } else {
      result.push(this.findBest(this.findSet(population, 0, presentNumber - 1), max));
    }
    for (let i = 1; i < numberOfSections; i++) {
      const y = this.findSet(population, i * presentNumber, (i * presentNumber + presentNumber - 1));
      if (y !== undefined) {
        result.push(this.findBest(y, max));
      }
    }
    if (l % numberOfSections !== 0) {
      const d = this.findSet(population, l - (l % numberOfSections), l);
      if (d !== undefined) {
        result.push(this.findBest(d, max));
      }
    }
    return result;
  }

  findSet(arr: Subject[], start, end): Subject[] {
    const t = [];
    for (let i = start; i <= end; i++) {
      t.push(arr[i]);
    }
    return t;
  }

  findBest(arr: Subject[], isMax): Subject {
    isMax ? arr.sort((a, b) => b.fitnessValue - a.fitnessValue) : arr.sort((a, b) => a.fitnessValue - b.fitnessValue);
    return arr[0];
  }
}

export class Mark {
  sub: Subject;
  mark: number;
  start: number;
  stop: number;
}
