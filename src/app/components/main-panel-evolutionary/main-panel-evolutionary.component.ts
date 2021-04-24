import {Component, ElementRef, ViewChild} from '@angular/core';
import {SelectionService, SelectionTypes} from '../../service/selection.service';
import {Subject} from '../../model/subject.model';
import {PopulationService} from '../../service/population.service';
import {ElitaryStrategyService} from '../../service/elitaryStrategy.service';
import {CrossingService, CrossoverTypes, EvoCrossoverTypes} from '../../service/crossing.service';
import {EvoMutationTypes, MutationService, MutationTypes} from '../../service/mutation.service';
import {InversionService} from '../../service/inversion.service';
import {GenerateFilesService} from '../../service/generateFiles.service';
import {Chart, ChartDataSets} from 'chart.js';
import {ChartsService} from '../../service/charts.service';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-main-panel-evolutionary',
  templateUrl: './main-panel-evolutionary.component.html',
  styleUrls: ['./main-panel-evolutionary.component.css']
})
export class MainPanelEvolutionaryComponent {

  @ViewChild('myChart') Chart: ElementRef;
  population: Subject[] = [];

  lineChartData: ChartDataSets[] = [
    {data: this.filesService.bestValues, label: ChartsService.signatures[0]},
  ];

  lineChartDataSTD: ChartDataSets[] = [
    {data: this.filesService.stdValues, label: ChartsService.signatures[1]},
  ];

  lineChartDataMean: ChartDataSets[] = [
    {data: this.filesService.meanValues, label: ChartsService.signatures[2]},
  ];


  lineChartOptions = {
    responsive: true,
    fill: false
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'pink',
      backgroundColor: 'white',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  rangeStart = -10;
  rangeEnd = 10;
  populationAmount = 100;
  epochsAmount = 100;
  bestAndTournamentChro = 40;
  ESamount = 10;
  crossProbability = 60;
  mutationProbability = 40;
  selectionChoice = SelectionTypes.BEST_SELECTION;
  crossChoice = EvoCrossoverTypes.ARITHMETICAL_CROSSOVER;
  mutationChoice = EvoMutationTypes.EVEN_MUTATION;
  maximization = false;

  lineChartLabels: Label[] = [];

  crossTypes = EvoCrossoverTypes;
  selectionTypes = SelectionTypes;
  mutationTypes = EvoMutationTypes;

  constructor(private populationService: PopulationService,
              private elitaryService: ElitaryStrategyService,
              private selectionService: SelectionService,
              private crossingService: CrossingService,
              private mutationService: MutationService,
              private inversionService: InversionService,
              private filesService: GenerateFilesService,
              private chartService: ChartsService) {
  }

  onSubmit(): void {
    this.filesService.clear();
    this.lineChartData = [
      {data: this.filesService.bestValues, label: ChartsService.signatures[0]},
    ];
    this.lineChartDataSTD = [
      {data: this.filesService.stdValues, label: ChartsService.signatures[1]},
    ];

    this.lineChartDataMean = [
      {data: this.filesService.meanValues, label: ChartsService.signatures[2]},
    ];
    console.log(this.rangeStart,
      this.rangeEnd,
      this.populationAmount,
      this.epochsAmount,
      this.bestAndTournamentChro,
      this.ESamount,
      this.crossProbability,
      this.mutationProbability,
      this.selectionChoice,
      this.crossChoice,
      this.mutationChoice,
      this.maximization);
    this.evolutionaryAlgorithm();
  }

  evolutionaryAlgorithm(): void {
    const startTime = Date.now();
    this.lineChartLabels = this.chartService.labels(this.epochsAmount);

    this.population = this.populationService.initEvolutionaryPopulation(this.populationAmount, this.rangeStart, this.rangeEnd);
    let bestSubjects: Subject[] = [];

    for (let i = 0; i < this.epochsAmount; i++) {
      let newPopulation: Subject[] = [];

      bestSubjects = this.elitaryService.elitaryStrategy(this.population, this.maximization, this.ESamount);

      this.population = this.selectionService.performSelection(
        this.population, this.bestAndTournamentChro, this.maximization, this.selectionChoice, this.populationAmount);

      while (newPopulation.length < (this.populationAmount - bestSubjects.length)) {
        const {parent1, parent2} = this.crossingService.prepareParents(this.population);
        const {child1, child2} = this.crossingService.performEvoCrossover(parent1, parent2, this.crossProbability, this.crossChoice);
        if (child1) {
          newPopulation.push(child1);
        }
        if (child2) {
          newPopulation.push(child2);
        }
      }

      newPopulation.forEach(subject => {
        subject = this.mutationService.performEvolutionaryMutation(
          subject, this.mutationProbability, this.mutationChoice, this.rangeStart, this.rangeEnd);
      });

      newPopulation = [...newPopulation, ...bestSubjects];
      newPopulation.forEach(subject => {
        subject.setVal();
      });
      this.population = newPopulation;
      this.filesService.saveValues(this.population, this.maximization);
    }

    const timeSpent = this.countTime(startTime);
    this.showAlert(timeSpent);
    this.filesService.prepareFiles();
    this.doChart(this.lineChartData, ChartsService.signatures[0]);
    this.doChart(this.lineChartDataSTD, ChartsService.signatures[1]);
    this.doChart(this.lineChartDataMean, ChartsService.signatures[2]);
  }

  public doChart(dataForChart, signature): void {
    const myChart = new Chart(this.Chart.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.lineChartLabels,
        datasets: dataForChart,
      },
      options: {
        scales: {
          xAxes: [{
            display: true,
          }]
        },
        animation: {
          onComplete(): void {
            myChart.update();
            const a = document.createElement('a');
            a.href = myChart.toBase64Image();
            a.download = signature + '.jpg';
            a.click();
            myChart.update();
          }
        }
      }
    });
  }

  countTime(startTime: number): number {
    const milliseconds = Date.now() - startTime;
    return milliseconds / 1000;
  }

  showAlert(time: number): void {
    const best = this.filesService.bestSubject;
    const message = `Found solution in ${time} seconds\n\nf(${best._x}, ${best._y}) = ${best.fitnessValue}`;
    alert(message);
  }
}
