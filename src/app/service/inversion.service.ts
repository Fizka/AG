import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class InversionService {

  private static checkProbability(probability: number): boolean {
    return (Math.random() * 100) <= probability;
  }

  private static reverse(chromosome: string): string {
    return chromosome.split('').reverse().join('');
  }

  private static inversion(chromosome: string, index1: number, index2: number): string {
    return chromosome.slice(0, index1) + InversionService.reverse(chromosome.slice(index1, index2)) + chromosome.slice(index2);
  }

  performInversion(subject: Subject, probability: number): Subject {
    if (InversionService.checkProbability(probability)) {

      const index1 = Math.floor(Math.random() * (subject.x.length - 1));
      const index2 = index1 + Math.floor(Math.random() * (subject.x.length - index1));

      subject.x = InversionService.inversion(subject.x, index1, index2);
      subject.y = InversionService.inversion(subject.y, index1, index2);
    }
    return subject;
  }
}
