import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

export enum MutationTypes {
  ONE_POINT_MUTATION = 'one-point',
  TWO_POINTS_MUTATION = 'two-points',
  BOUNDARY_MUTATION = 'homogeneous'
}

@Injectable({
  providedIn: 'root'
})
export class MutationService {

  private static checkProbability(probability: number): boolean {
    return (Math.random() * 100) <= probability;
  }

  private static changeBit(chromosome: string, index: number): string {
    return chromosome.slice(0, index) + chromosome[index] === '0' ? '1' : '0' + chromosome.slice(index + 1);
  }

  private static onePointMutation(subject: Subject): Subject {
    const index = Math.floor(Math.random() * (subject.x.length - 1));
    subject.x = this.changeBit(subject.x, index);
    subject.y = this.changeBit(subject.y, index);
    return subject;
  }

  private static twoPointsMutation(subject: Subject): Subject {
    let secondChange = false;
    const index = Math.floor(Math.random() * (subject.x.length - 1));
    subject.x = this.changeBit(subject.x, index);
    subject.y = this.changeBit(subject.y, index);

    while (!secondChange) {
      const i = Math.floor(Math.random() * (subject.x.length - 1));
      if (i !== index) {
        subject.x = this.changeBit(subject.x, index);
        subject.y = this.changeBit(subject.y, index);
        secondChange = true;
      }
    }
    return subject;
  }

  private static boundaryMutation(subject: Subject): Subject {
    subject.x = this.changeBit(subject.x, subject.x.length - 1);
    subject.y = this.changeBit(subject.y, subject.y.length - 1);
    return subject;
  }

  performMutation(subject: Subject, probability: number, selectedMutation: MutationTypes): Subject {
    if (MutationService.checkProbability(probability)) {
      switch (selectedMutation) {
        case MutationTypes.ONE_POINT_MUTATION: {
          subject = MutationService.onePointMutation(subject);
          break;
        }
        case MutationTypes.TWO_POINTS_MUTATION: {
          subject = MutationService.twoPointsMutation(subject);
          break;
        }
        case MutationTypes.BOUNDARY_MUTATION: {
          subject = MutationService.boundaryMutation(subject);
          break;
        }
      }
    }
    return subject;
  }


}
