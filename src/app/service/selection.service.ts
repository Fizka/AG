import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() {
  }

  private getProcent(population, procent): number {
    return Math.round(population * (procent) / 100);
  }

  public selectionBest(population: Subject[], procent, findMin) {
    let sub = population;
    sub = findMin ? sub.sort((a, b) => a.fitnessValue - b.fitnessValue) : sub.sort((a, b) => b.fitnessValue - a.fitnessValue);
    let resoult2: Subject[] = [];
    console.log(this.getProcent(sub.length, procent));
    for (let i = 0; i < this.getProcent(sub.length, procent); i++) {
      resoult2.push(sub.shift());
    }
    console.log(resoult2);
    return resoult2;
  }

  public selectionRoulette(population: Subject[], howMuch): Subject[] {
    let sub = population;
    let poolIndex = this.getPoolIndex(0, sub.length - 1, howMuch);
    console.log(poolIndex);
    sub = sub.filter(p => {
      return poolIndex.findIndex(val => val == sub.indexOf(p)) != -1;
    });
    console.log(sub);
    return sub;
  }

  private getPoolIndex(indexMin, indexMax, howMuch): number[] {
    let poolIndex = [];
    poolIndex.push(this.getRandomInt(indexMin, indexMax));
    for (let i = 1; i < howMuch; i++) {
      let randoIndex = this.getRandomInt(indexMin, indexMax);
      poolIndex.findIndex(val => val == randoIndex) == -1 ? poolIndex.push(randoIndex) : howMuch++;
    }
    return poolIndex;
  }

  private getRandomInt(indexMin, indexMax): number {
    indexMin = Math.ceil(indexMin);
    indexMax = Math.floor(indexMax);
    return Math.floor(Math.random() * (indexMax - indexMin)) + indexMin;
  }

  public selectionTournament(population: Subject[], numberOfSections): Subject[] {
    let resoult: Subject[] = [];
    let presentNumber = Math.round(population.length / numberOfSections);
    if (population.length < numberOfSections) {
      resoult.push(this.findBest(this.findSet(population, 0, population.length), true));
    } else {
      resoult.push(this.findBest(this.findSet(population, 0, presentNumber - 1), true));
    }
    for (let i = 1; i < numberOfSections; i++) {
      resoult.push(this.findBest(this.findSet(population, i * presentNumber, (i * presentNumber + presentNumber - 1)), true));
    }
    if (population.length % numberOfSections != 0) {
      resoult.push(this.findBest(this.findSet(population, population.length - (population.length % numberOfSections), population.length), true));
    }
    console.log(resoult);
    return resoult;
  }

  findSet(arr: Subject[], start, end): Subject[] {
    let t = [];
    for (let i = start; i <= end; i++) {
      t.push(arr[i]);
    }
    return t;
  }

  findBest(arr: Subject[], isMax): Subject {
    let res = isMax ? arr.sort((a, b) => b.fitnessValue - a.fitnessValue) : arr.sort((a, b) => a.fitnessValue - b.fitnessValue);
    return res[0];
  }
}

