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

  public selectionBest(population: Subject[], percent: number, findMin: boolean): Subject[] {
    let sub = population;
    sub = findMin ? sub.sort((a, b) => a.fitnessValue - b.fitnessValue) : sub.sort((a, b) => b.fitnessValue - a.fitnessValue);
    const result2: Subject[] = [];
    // console.log(SelectionService.getProcent(sub.length, percent));
    for (let i = 0; i < SelectionService.getProcent(sub.length, percent); i++) {
      result2.push(sub.shift());
    }
    // console.log(result2);
    return result2;
  }

  public selectionRoulette(population: Subject[], howMuch): Subject[] {
    let sub = population;
    const poolIndex = this.getPoolIndex(0, sub.length - 1, howMuch);
    // console.log(poolIndex);
    sub = sub.filter(p => {
      return poolIndex.findIndex(val => val === sub.indexOf(p)) !== -1;
    });
    // console.log(sub);
    return sub;
  }

  private getPoolIndex(indexMin, indexMax, howMuch): number[] {
    const poolIndex = [];
    poolIndex.push(SelectionService.getRandomInt(indexMin, indexMax));
    for (let i = 1; i < howMuch; i++) {
      const randomIndex = SelectionService.getRandomInt(indexMin, indexMax);
      poolIndex.findIndex(val => val === randomIndex) === -1 ? poolIndex.push(randomIndex) : howMuch++;
    }
    return poolIndex;
  }

  public selectionTournament(population: Subject[], numberOfSections): Subject[] {
    const result: Subject[] = [];
    const presentNumber = Math.round(population.length / numberOfSections);
    if (population.length < numberOfSections) {
      result.push(this.findBest(this.findSet(population, 0, population.length), true));
    } else {
      result.push(this.findBest(this.findSet(population, 0, presentNumber - 1), true));
    }
    for (let i = 1; i < numberOfSections; i++) {
      result.push(this.findBest(this.findSet(population, i * presentNumber, (i * presentNumber + presentNumber - 1)), true));
    }
    if (population.length % numberOfSections !== 0) {
      result.push(this.findBest(this.findSet(population, population.length - (population.length % numberOfSections), population.length), true));
    }
    // console.log(result);
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

