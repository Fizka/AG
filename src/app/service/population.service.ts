import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class PopulationService {

  private bottom: number;
  private upper: number;

  initPopulation(populationSize: number, chromosomeLength: number, bottom: number, upper: number): Subject[] {
    this.bottom = bottom;
    this.upper = upper;

    const tab = new Array<Subject>();
    const subject = new Subject();
    for (let i = 0; i < populationSize; i++) {
      const x = this.generateChromosome(chromosomeLength);
      const y = this.generateChromosome(chromosomeLength);
      subject.setX(x, this.decodeChromosome(x));
      subject.setY(y, this.decodeChromosome(y));
      tab.push(subject);
    }
    return tab;
  }

  generateChromosome(chromosomeLength: number): string {
    let bits = '';
    for (let i = 0; i < chromosomeLength - 1; i++) {
      bits += Math.round(Math.random());
    }
    return bits;
  }

  decodeChromosome(chromosome: string): number {
    return this.bottom + this.binaryToDecimal(chromosome) * (this.bottom - this.upper)
      / (Math.pow(2, (chromosome.length + 1)) - 1);
  }

  binaryToDecimal(binary: string): number {
    return binary.split('').reverse().reduce((x, y, i) => {
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
  }
}
