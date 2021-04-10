import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';


@Injectable({
  providedIn: 'root'
})
export class ElitaryStrategyService {

  elitaryStrategy(population: Subject[], maximization: boolean, amountToSave: number): Subject[] {
    const amount = Math.floor(amountToSave * population.length / 100);
    population = maximization ? population.sort((a, b) => b.fitnessValue - a.fitnessValue)
      : population.sort((a, b) => a.fitnessValue - b.fitnessValue);
    return population.slice(0, amount);
  }
}
