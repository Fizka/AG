import {Injectable} from '@angular/core';
import {Subject} from './subject.model';

@Injectable({
  providedIn: 'root'
})
export class PopulationService {

  getFitnessValue(x: number, y: number): number {
    return Math.pow((x + 2 * y - 7), 2) + Math.pow((2 * x + y - 5), 2);
  }

  initPopulation(populationSize: number, chromosomeLength: number): Subject[] {
    const tab = new Array<Subject>();
    const subject = new Subject();
    for (let i = 0; i < populationSize; i++) {
      subject.x = this.generateChromosome(chromosomeLength);
      subject.y = this.generateChromosome(chromosomeLength);
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

  decodeChromosome(chromosome: string, bottom: number, upper: number): number {
    return bottom + this.binaryToDecimal(chromosome) * (bottom - upper)
      / (Math.pow(2, (chromosome.length + 1)) - 1);
  }

  binaryToDecimal(binary: string): number {
    return binary.split('').reverse().reduce((x, y, i) => {
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
  }
}
