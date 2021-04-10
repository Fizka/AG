import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionService, SelectionTypes} from '../../service/selection.service';
import {Subject} from '../../model/subject.model';
import {PopulationService} from '../../service/population.service';
import {ElitaryStrategyService} from '../../service/elitaryStrategy.service';
import {CrossingService, CrossoverTypes} from '../../service/crossing.service';
import {MutationService, MutationTypes} from '../../service/mutation.service';
import {InversionService} from '../../service/inversion.service';
import {GenerateFilesService} from '../../service/generateFiles.service';
import {Chart, ChartDataSets} from 'chart.js';
import {ChartsService} from '../../service/charts.service';
import {Color, Label} from 'ng2-charts';


@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent {

  @ViewChild('myChart') Chart: ElementRef;
  population: Subject[] = [];

  lineChartData: ChartDataSets[] = [
    {data: this.filesService.bestValues, label: ChartsService.signatures[0]},
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

  rangeStart = 1;
  rangeEnd = 10;
  populationAmount = 20;
  numberOfBits = 10;
  epochsAmount = 100;
  bestAndTournamentChro = 50;
  ESamount = 10;
  crossProbability = 80;
  mutationProbability = 40;
  inversionProbability = 20;
  selectionChoice = SelectionTypes.ROULETTE_SELECTION;
  crossChoice = CrossoverTypes.HOMOGENEOUS_CROSSOVER;
  mutationChoice = MutationTypes.BOUNDARY_MUTATION;
  maximization = false;

  lineChartLabels: Label[] = [];

  crossTypes = CrossoverTypes;
  selectionTypes = SelectionTypes;
  mutationTypes = MutationTypes;

  constructor(private populationService: PopulationService,
              private elitaryService: ElitaryStrategyService,
              private selectionService: SelectionService,
              private crossingService: CrossingService,
              private mutationService: MutationService,
              private inversionService: InversionService,
              private filesService: GenerateFilesService,
              private chartService: ChartsService) {
  }

  algorithm(): void {
    const startTime = Date.now();
    this.lineChartLabels = this.chartService.labels(this.epochsAmount);

    // generacja początkowej populacji i obliczamy wartość funkcji
    this.population = this.populationService.initPopulation(this.populationAmount, this.numberOfBits, this.rangeStart, this.rangeEnd);
    let newPopulation: Subject[] = [];
    let bestSubjects: Subject[] = [];

    for (let i = 0; i < this.epochsAmount; i++) {
      // ewaluacja
      this.population.forEach(subject => {
        subject = this.populationService.decodeSubject(subject);
      });

      bestSubjects = this.elitaryService.elitaryStrategy(this.population, this.maximization, this.ESamount);

      this.population = this.selectionService.performSelection(
        this.population, this.bestAndTournamentChro, this.maximization, this.selectionChoice);

      // krzyżowanie
      while (newPopulation.length < (this.populationAmount - bestSubjects.length)) {
        const {parent1, parent2} = this.crossingService.prepareParents(this.population);
        const {child1, child2} = this.crossingService.performCrossover(parent1, parent2, this.crossProbability, this.crossChoice);
        newPopulation.push(child1, child2);
      }

      // mutacja
      newPopulation.forEach(subject => {
        subject = this.mutationService.performMutation(subject, this.mutationProbability, this.mutationChoice);
      });

      // inwersja
      newPopulation.forEach(subject => {
        subject = this.inversionService.performInversion(subject, this.inversionProbability);
      });

      newPopulation = [...newPopulation, ...bestSubjects];
      newPopulation.forEach(subject => {
        subject = this.populationService.decodeSubject(subject);
      });
      this.population = newPopulation;
      this.filesService.saveValues(this.population, this.maximization);
    }

    const timeSpent = this.countTime(startTime);
    console.log('Time spent: ' + timeSpent);
    this.filesService.prepareFiles();
    this.doChart(this.lineChartData, ChartsService.signatures[0]);
    this.doChart(this.chartService.lineChartDataSTD, ChartsService.signatures[1]);
    this.doChart(this.chartService.lineChartDataMean, ChartsService.signatures[2]);
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
            const image = myChart.toBase64Image();
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
      this.mutationChoice,
      this.maximization);
    this.algorithm();

  }

  countTime(startTime: number): number {
    const milliseconds = Date.now() - startTime;
    return milliseconds / 1000;
  }
}
