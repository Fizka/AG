import {Component} from '@angular/core';
import {CrossingService} from './service/crossing.service';
import {GenerateFilesService} from './service/generateFiles.service';
import {InversionService} from './service/inversion.service';
import {PopulationService} from './service/population.service';
import {Subject} from './model/subject.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AlgoGene';

  population: Subject[] = [];
  maximization = false;
  startTime = Date.now();

  constructor(protected populationService: PopulationService,
              protected crossingService: CrossingService,
              protected inversionService: InversionService,
              protected generateFilesService: GenerateFilesService) { }

  // na początku algorytmu obliczamy _x i _y dla każdego osobnika, później nie zwracamy na nie uwagi

  getFittiest(): Subject {
    return this.population.reduce((prev, current) => {
      return ((prev.fitnessValue > current.fitnessValue) && this.maximization) ? prev : current;
    });
  }

  elitaryStrategy(amountToSave: number): Subject[] {
    const amount = Math.floor(amountToSave * this.population.length / 100);
    const newPopulation: Subject[] = [];
    this.population.forEach(subject => {
      if (newPopulation.length < amount) {
        newPopulation.push(subject);
      } else {
        for (let _subject of newPopulation) {
          if (subject.fitnessValue > _subject.fitnessValue && this.maximization
            || subject.fitnessValue < _subject.fitnessValue && !this.maximization) {
            _subject = subject;
            break;
          }
        }
      }
    });
    return newPopulation;
  }

  countTime(): number {
    const milliseconds = Date.now() - this.startTime;
    return milliseconds / 1000;
  }
}
