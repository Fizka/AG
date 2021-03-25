import {Component} from '@angular/core';
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

  constructor(protected populationService: PopulationService) {
  }

  getFittiest(): Subject {
    return this.population.reduce((prev, current) => {
      return ((prev.fitnessValue > current.fitnessValue) && this.maximization) ? prev : current;
    });
  }
}
