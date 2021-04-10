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

  performSelection(population: Subject[], parameter: number, maximization: boolean, selectionType: SelectionTypes): Subject[] {
    let nextPopulation: Subject[];
    switch (selectionType) {
      case SelectionTypes.BEST_SELECTION: {
        nextPopulation = this.selectionBest(population, parameter, maximization);
        break;
      }
      case SelectionTypes.ROULETTE_SELECTION: {
        nextPopulation = this.selectionRoulette(population, parameter);
        break;
      }
      case SelectionTypes.TOURNAMENT_SELECTION: {
        nextPopulation = this.selectionTournament(population, parameter);
        break;
      }
    }
    return nextPopulation;
  }

  public selectionBest(population: Subject[], percent: number, findMax: boolean): Subject[] {
    let sub = population;
    sub = findMax ? sub.sort((a, b) => b.fitnessValue - a.fitnessValue) : sub.sort((a, b) => a.fitnessValue - b.fitnessValue);
    sub.splice(SelectionService.getProcent(sub.length, percent));
    return sub;
  }

  public selectionRoulette(population: Subject[], howMuch): Subject[] {
    const sub = population;
    const poolIndex = this.getPoolIndex(0, population.length - 1, SelectionService.getProcent(population.length, howMuch));
    const gg = [];
    for (const index of poolIndex) {
      gg.push(sub[index]);
    }
    return gg;
  }

  private getPoolIndex(indexMin, indexMax, howMuch): number[] {
    const poolIndex = [];
    poolIndex.push(SelectionService.getRandomInt(indexMin, indexMax));
    while (poolIndex.length < howMuch) {
      const randomIndex = SelectionService.getRandomInt(indexMin, indexMax);
      if (poolIndex.indexOf(randomIndex) === -1) {
        poolIndex.push(randomIndex);
      }
    }
    return poolIndex;
  }

  public selectionTournament(population: Subject[], numberOfSections): Subject[] {
    const result: Subject[] = [];
    const l = population.length;
    const presentNumber = Math.round(population.length / numberOfSections);
    if (l < numberOfSections) {
      result.push(this.findBest(this.findSet(population, 0, l), true));
    } else {
      result.push(this.findBest(this.findSet(population, 0, presentNumber - 1), true));
    }
    for (let i = 1; i < numberOfSections; i++) {
      result.push(this.findBest(this.findSet(population, i * presentNumber, (i * presentNumber + presentNumber - 1)), true));
    }
    if (l % numberOfSections !== 0) {
      result.push(this.findBest(this.findSet(population, l - (l % numberOfSections), l), true));
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
    const res = isMax ? arr.sort((a, b) => b.fitnessValue - a.fitnessValue) : arr.sort((a, b) => a.fitnessValue - b.fitnessValue);
    return res[0];
  }
}
