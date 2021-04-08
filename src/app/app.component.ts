import {Component} from '@angular/core';
import {CrossingService} from './service/crossing.service';
import {GenerateFilesService} from './service/generateFiles.service';
import {InversionService} from './service/inversion.service';
import {PopulationService} from './service/population.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AlgoGene';

  constructor(protected populationService: PopulationService,
              protected crossingService: CrossingService,
              protected inversionService: InversionService,
              protected generateFilesService: GenerateFilesService) { }

  // na początku algorytmu obliczamy _x i _y dla każdego osobnika, później nie zwracamy na nie uwagi
}
