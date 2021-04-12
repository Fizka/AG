import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class PopulationService {

  private bottom: number;
  private upper: number;

  private static generateChromosome(chromosomeLength: number): string {
    let bits = '';
    for (let i = 0; i < chromosomeLength; i++) {
      bits += Math.round(Math.random());
    }
    return bits;
  }

  initPopulation(populationSize: number, chromosomeLength: number, bottom: number, upper: number): Subject[] {
    this.bottom = bottom;
    this.upper = upper;

    const population: Subject[] = [];
    let subject = new Subject();
    for (let i = 0; i < populationSize; i++) {
      subject = new Subject();
      const x = PopulationService.generateChromosome(chromosomeLength);
      const y = PopulationService.generateChromosome(chromosomeLength);
      subject.setX(x, this.decodeChromosome(x));
      subject.setY(y, this.decodeChromosome(y));
      population.push(subject);
    }
    return population;
  }

  decodeSubject(subject: Subject): Subject {
    subject._x = this.decodeChromosome(subject.x);
    subject._y = this.decodeChromosome(subject.y);
    return subject;
  }

  private decodeChromosome(chromosome: string): number {
    return this.bottom + this.binaryToDecimal(chromosome) * (this.upper - this.bottom)
      / (Math.pow(2, chromosome.length) - 1);
  }

  private binaryToDecimal(binary: string): number {
    return binary.split('').reverse().reduce((x, y, i) => {
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
  }
}
