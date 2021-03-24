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

  constructor(protected populationService: PopulationService) {
  }
}
