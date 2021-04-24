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

  private getSum(population: Subject[]): number {
    let sum = 0;
    population.forEach(p => {
      sum += p.fitnessValue;
    });
    return sum;
  }

  private createMarks(population: Subject[], sum): Mark[] {
    let last = 0;
    const marks: Mark[] = [];
    population.forEach(p => {
      const mark: Mark = new Mark();
      mark.mark = p.fitnessValue / sum;
      mark.sub = p;
      mark.start = last;
      mark.stop = last + mark.mark;
      last += mark.mark;
      marks.push(mark);
    });
    return marks;
  }

  private getCondition(marks: Mark[], randomIndex):number{
    return marks.findIndex(p => p.start <= randomIndex && p.stop > randomIndex);
  }

  private getConditionPasses(population: Subject[], index, marks: Mark[]):number{
    return population.findIndex(d => marks[index].sub.x === d.x && marks[index].sub.y === d.y)
  }

  public selectionRoulette(population: Subject[], howMuch, popLen): Subject[] {
    const subjects = population;
    let subjectsTemp: Subject[] = [];
    let sumFunFitness = this.getSum(subjects);
    let marks: Mark[] = this.createMarks(subjects, sumFunFitness);

    if (howMuch <= 50) {
      const value = this.getCondition(marks, Math.random());
      if (marks[value].sub !== undefined && value !== undefined) {
        subjectsTemp = Array.of(marks[value].sub);
      }
      while (subjectsTemp.length < SelectionService.getProcent(popLen, howMuch)) {
        const val = this.getCondition(marks, Math.random());
        if (val !== undefined) {
          if (this.getConditionPasses(subjectsTemp, val, marks) === -1) {
            if (marks[val].sub !== undefined) {
              subjectsTemp.push(marks[val].sub);
            }
          }
        }
      }
      subjectsTemp.pop();
    } else {
      while (subjects.length !== SelectionService.getProcent(popLen, howMuch)) {
        const randomIndex = Math.random();
        const val = marks.findIndex(p => p.start <= randomIndex && p.stop > randomIndex);
        if (val !== undefined) {
          const popindex = this.getConditionPasses(subjects, val, marks);
          if (popindex !== -1) {
            subjects.splice(popindex, 1);
          }
        }
      }
    }
    return howMuch > 50 ? subjects : subjectsTemp;
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
