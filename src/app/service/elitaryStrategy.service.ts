import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';


@Injectable({
  providedIn: 'root'
})
export class ElitaryStrategyService {

  elitaryStrategy(population: Subject[], maximization: boolean, amountToSave: number): Subject[] {
    const amount = Math.floor(amountToSave * population.length / 100);
    const newPopulation: Subject[] = [];
    population.forEach(subject => {
      if (newPopulation.length < amount) {
        newPopulation.push(subject);
      } else {
        for (let _subject of newPopulation) {
          if (subject.fitnessValue > _subject.fitnessValue && maximization
            || subject.fitnessValue < _subject.fitnessValue && !maximization) {
            _subject = subject;
            break;
          }
        }
      }
    });
    return newPopulation;
  }
}
