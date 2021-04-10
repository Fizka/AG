import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

export enum CrossoverTypes {
  ONE_POINT_CROSSOVER = 'ONE POINT',
  TWO_POINTS_CROSSOVER = 'TWO POINTS',
  THREE_POINTS_CROSSOVER = 'THREE POINTS',
  HOMOGENEOUS_CROSSOVER = 'HOMOGENEOUS'
}

export interface Parents {
  parent1: string;
  parent2: string;
}

export interface SelectedParents {
  parent1: Subject;
  parent2: Subject;
}

export interface Children {
  child1: Subject;
  child2: Subject;
}

@Injectable({
  providedIn: 'root'
})
export class CrossingService {

  private index1: number;
  private index2: number;
  private index3: number;

  private static checkProbability(probability: number): boolean {
    return (Math.random() * 100) <= probability;
  }

  private static prepareChildren(x: Parents, y: Parents): Children {
    const child1 = new Subject();
    const child2 = new Subject();

    child1.x = x.parent1;
    child1.y = y.parent1;
    child2.x = x.parent2;
    child2.y = y.parent2;

    return {child1, child2};
  }

  private static homogeneousCrossing(chromosome1: string, chromosome2: string): Parents {
    for (let i = 0; i < chromosome1.length; i++) {
      if (Math.random() >= 0.5) {
        const bit = chromosome1[i];
        chromosome1 = chromosome1.slice(0, i) + chromosome2[i] + chromosome1.slice(i + 1);
        chromosome2 = chromosome2.slice(0, i) + bit + chromosome2.slice(i + 1);
      }
    }
    return {parent1: chromosome1, parent2: chromosome2};
  }

  private onePointCrossing(chromosome1: string, chromosome2: string): Parents {
    const piece = chromosome1.slice(this.index1);
    chromosome1 = chromosome1.slice(0, this.index1) + chromosome2.slice(this.index1);
    chromosome2 = chromosome2.slice(0, this.index1) + piece;
    return {parent1: chromosome1, parent2: chromosome2};
  }

  private twoPointsCrossing(chromosome1: string, chromosome2: string): Parents {
    const piece = chromosome1.slice(this.index1, this.index2);
    chromosome1 = chromosome1.slice(0, this.index1) + chromosome2.slice(this.index1, this.index2) + chromosome1.slice(this.index2);
    chromosome2 = chromosome2.slice(0, this.index1) + piece + chromosome2.slice(this.index2);
    return {parent1: chromosome1, parent2: chromosome2};
  }

  private threePointsCrossing(chromosome1: string, chromosome2: string): Parents {
    const piece1 = chromosome1.slice(this.index1, this.index2);
    const piece2 = chromosome1.slice(this.index3);
    chromosome1 = chromosome1.slice(0, this.index1) + chromosome2.slice(this.index1, this.index2)
      + chromosome1.slice(this.index2, this.index3) + chromosome2.slice(this.index3);
    chromosome2 = chromosome2.slice(0, this.index1) + piece1 + chromosome2.slice(this.index2, this.index3) + piece2;
    return {parent1: chromosome1, parent2: chromosome2};
  }

  private prepareIndexes(parentSize: number): void {
    this.index1 = Math.floor(Math.random() * (parentSize - 1));
    this.index2 = this.index1 + Math.floor(Math.random() * (parentSize - this.index1));
    this.index3 = this.index2 + Math.floor(Math.random() * (parentSize - this.index2));
  }

  prepareParents(population: Subject[]): SelectedParents {
    const parent1 = Math.floor(Math.random() * (population.length - 1));
    let parent2 = Math.floor(Math.random() * (population.length - 1));
    while (parent1 === parent2) {
      parent2 = Math.floor(Math.random() * (population.length - 1));
    }
    return {parent1: population[parent1], parent2: population[parent2]};
  }

  performCrossover(parent1: Subject, parent2: Subject, probability: number, selectedCross: CrossoverTypes): Children {
    let x: Parents;
    let y: Parents;

    if (CrossingService.checkProbability(probability)) {

      switch (selectedCross) {
        case CrossoverTypes.ONE_POINT_CROSSOVER: {
          this.prepareIndexes(parent1.x.length);
          x = this.onePointCrossing(parent1.x, parent2.x);
          y = this.onePointCrossing(parent1.y, parent2.y);
          break;
        }
        case CrossoverTypes.TWO_POINTS_CROSSOVER: {
          this.prepareIndexes(parent1.x.length);
          x = this.twoPointsCrossing(parent1.x, parent2.x);
          y = this.twoPointsCrossing(parent1.y, parent2.y);
          break;
        }
        case CrossoverTypes.THREE_POINTS_CROSSOVER: {
          this.prepareIndexes(parent1.x.length);
          x = this.threePointsCrossing(parent1.x, parent2.x);
          y = this.threePointsCrossing(parent1.y, parent2.y);
          break;
        }
        case CrossoverTypes.HOMOGENEOUS_CROSSOVER: {
          x = CrossingService.homogeneousCrossing(parent1.x, parent2.x);
          y = CrossingService.homogeneousCrossing(parent1.y, parent2.y);
          break;
        }
      }
      return CrossingService.prepareChildren(x, y);
    }
    return {child1: parent1, child2: parent2};
  }
}
