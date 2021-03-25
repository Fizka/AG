import {Subject} from './subject.model';
import {Injectable} from '@angular/core';
import {PopulationService} from './population.service';

export enum CrossoverTypes {
  ONE_POINT_CROSSOVER = 'one-point',
  TWO_POINTS_CROSSOVER = 'two-points',
  THREE_POINTS_CROSSOVER = 'three-points',
  HOMOGENEOUS_CROSSOVER = 'homogeneous'
}

@Injectable({
  providedIn: 'root'
})
export class CrossingService {

  private index1: number;
  private index2: number;

  constructor(protected populationService: PopulationService){}

  prepareIndexes(parentSize: number): void{
    this.index1 = Math.floor(Math.random() * (parentSize - 1));
    this.index2 = this.index1 + Math.floor(Math.random() * (parentSize - this.index1));
  }

  performCrossover(parent1: Subject, parent2: Subject, probability: number, selectedCross: CrossoverTypes): Subject {
    const children = new Subject();
    let x: string;
    let y: string;

    switch (selectedCross) {
      case CrossoverTypes.ONE_POINT_CROSSOVER: {
        this.prepareIndexes(parent1.x.length);
        x = this.onePointCrossing(parent1.x, parent2.x, probability);
        y = this.onePointCrossing(parent1.y, parent2.y, probability);
        break;
      }
      case CrossoverTypes.TWO_POINTS_CROSSOVER: {
        this.prepareIndexes(parent1.x.length);
        x = this.twoPointsCrossing(parent1.x, parent2.x, probability);
        y = this.twoPointsCrossing(parent1.y, parent2.y, probability);
        break;
      }
      case CrossoverTypes.THREE_POINTS_CROSSOVER: {
        this.prepareIndexes(parent1.x.length);
        x = this.threePointsCrossing(parent1.x, parent2.x, probability);
        y = this.threePointsCrossing(parent1.y, parent2.y, probability);
        break;
      }
      case CrossoverTypes.HOMOGENEOUS_CROSSOVER: {
        this.prepareIndexes(parent1.x.length);
        x = this.homogeneousCrossing(parent1.x, parent2.x, probability);
        y = this.homogeneousCrossing(parent1.y, parent2.y, probability);
        break;
      }
    }
    children.setX(x, this.populationService.decodeChromosome(x));
    children.setY(y, this.populationService.decodeChromosome(y));
    return children;
  }

  onePointCrossing(chromosome1: string, chromosome2: string, probability: number): string {
    return chromosome1;
  }

  twoPointsCrossing(chromosome1: string, chromosome2: string, probability: number): string {
    return chromosome1;
  }

  threePointsCrossing(chromosome1: string, chromosome2: string, probability: number): string {
    return chromosome1;
  }

  homogeneousCrossing(chromosome1: string, chromosome2: string, probability: number): string {
    return chromosome1;
  }
}
