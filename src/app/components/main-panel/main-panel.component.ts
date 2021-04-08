import {Component} from '@angular/core';
import {SelectionService, SelectionTypes} from '../../service/selection.service';
import {Subject} from '../../model/subject.model';
import {PopulationService} from '../../service/population.service';
import {ElitaryStrategyService} from '../../service/elitaryStrategy.service';
import {CrossingService, CrossoverTypes} from '../../service/crossing.service';
import {MutationService, MutationTypes} from '../../service/mutation.service';
import {InversionService} from '../../service/inversion.service';
import {GenerateFilesService} from '../../service/generateFiles.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent {

  population: Subject[] = [];

  rangeStart = 1;
  rangeEnd = 10;
  populationAmount = 20;
  numberOfBits = 10;
  epochsAmount = 15;
  bestAndTournamentChro = 90;
  ESamount = 10;
  crossProbability = 80;
  mutationProbability = 40;
  inversionProbability = 20;
  selectionChoice = SelectionTypes.BEST_SELECTION;
  crossChoice = CrossoverTypes.ONE_POINT_CROSSOVER;
  mutationChoice = MutationTypes.ONE_POINT_MUTATION;
  maximization = false;

  crossTypes = CrossoverTypes;
  selectionTypes = SelectionTypes;
  mutationTypes = MutationTypes;

  constructor(private populationService: PopulationService,
              private elitaryService: ElitaryStrategyService,
              private selectionService: SelectionService,
              private crossingService: CrossingService,
              private mutationService: MutationService,
              private inversionService: InversionService,
              private filesService: GenerateFilesService) {
    // this.population = this.populationService.initPopulation(10, 10, 1, 10;
    // console.log(this.population);
    // this.population.forEach(subject => {
    //   console.log('subject before');
    //   console.log(subject);
    //   subject = this.mutationService.performMutation(subject, this.mutationProbability, this.mutationChoice);
    //   console.log('subject after');
    //   console.log(subject);
    // });
  }

  algorithm(): void {
    const startTime = Date.now();

    // generacja początkowej populacji i obliczamy wartość funkcji
    this.population = this.populationService.initPopulation(this.populationAmount, this.numberOfBits, this.rangeStart, this.rangeEnd);
    console.log(this.population);
    let newPopulation: Subject[] = [];

    for (let i = 0; i < this.epochsAmount; i++) {
      // ewaluacja
      this.population.forEach(subject => {
        subject = this.populationService.decodeSubject(subject);
      });

      // strategia elitarna
      newPopulation = this.elitaryService.elitaryStrategy(this.population, this.maximization, this.ESamount);

      // selekcja
      this.population = this.selectionService.performSelection(
        this.population, this.bestAndTournamentChro, this.maximization, this.selectionChoice);

      // krzyżowanie
      while (newPopulation.length < this.populationAmount) {
        const {parent1, parent2} = this.crossingService.prepareParents(this.population);
        const {child1, child2} = this.crossingService.performCrossover(parent1, parent2, this.crossProbability, this.crossChoice);
        newPopulation.push(child1, child2);
      }

      // mutacja
      newPopulation.forEach(subject => {
        // console.log('subject before')
        // console.log(subject)
        subject = this.mutationService.performMutation(subject, this.mutationProbability, this.mutationChoice);
        // console.log('subject after')
        // console.log(subject)
      });

      // inwersja
      newPopulation.forEach(subject => {
        subject = this.inversionService.performInversion(subject, this.inversionProbability);
      });

      this.population = newPopulation;
      // this.filesService.saveValues(this.population, this.maximization);
    }

    const timeSpent = this.countTime(startTime);
    console.log('Time spent: ' + timeSpent);
    // this.filesService.prepareFiles();
  }

  onSubmit(): void {
    console.log(this.rangeStart,
      this.rangeEnd,
      this.populationAmount,
      this.numberOfBits,
      this.epochsAmount,
      this.bestAndTournamentChro,
      this.ESamount,
      this.crossProbability,
      this.mutationProbability,
      this.inversionProbability,
      this.selectionChoice,
      this.crossChoice,
      this.mutationChoice);
    this.algorithm();
  }

  countTime(startTime: number): number {
    const milliseconds = Date.now() - startTime;
    return milliseconds / 1000;
  }
}
