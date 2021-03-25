import {Component} from '@angular/core';
import {CrossingService} from './crossing.service';
import {InversionService} from './inversion.service';
import {PopulationService} from './population.service';
import {Subject} from './subject.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AlgoGene';

  population: Subject[] = [];
  maximization = false;

  constructor(protected populationService: PopulationService,
              protected crossingService: CrossingService,
              protected inversionService: InversionService) { }

  // na początku algorytmu obliczamy _x i _y dla każdego osobnika, później nie zwracamy na nie uwagi

  getFittiest(): Subject {
    return this.population.reduce((prev, current) => {
      return ((prev.fitnessValue > current.fitnessValue) && this.maximization) ? prev : current;
    });
  }
}
