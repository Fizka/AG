import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class GenerateFilesService {

  get bestSubject(): Subject {
    return this.best;
  }

  private best: Subject;

  public bestValues: number[] = [];
  public meanValues: number[] = [];
  public stdValues: number[] = [];

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  private static sortPopulation(population: Subject[], maximization: boolean): Subject[] {
    population = maximization ? population.sort((a, b) => b.fitnessValue - a.fitnessValue)
      : population.sort((a, b) => a.fitnessValue - b.fitnessValue);
    return population;
  }

  private saveMinMaxValue(population: Subject[], maximization: boolean): void {
    population = GenerateFilesService.sortPopulation(population, maximization);
    const best = population[0];
    if (!this.bestSubject || (this.bestSubject.fitnessValue < best.fitnessValue && maximization)
      || (this.bestSubject.fitnessValue > best.fitnessValue && ! maximization)) {
      this.best = best;
    }
    this.bestValues.push(this.best.fitnessValue);
  }

  private getMeanValue(population: Subject[]): number {
    let mean = 0;
    population.forEach(subject => {
      mean += subject.fitnessValue;
    });
    return mean / population.length;
  }

  private saveMeanValue(population: Subject[]): void {
    this.meanValues.push(this.getMeanValue(population));
  }

  private saveStdValue(population: Subject[]): void {
    let value = 0;
    const mean = this.getMeanValue(population);
    population.forEach(subject => {
      value += Math.pow((subject.fitnessValue - mean), 2);
    });
    value = Math.sqrt(value / population.length);
    this.stdValues.push(value);
  }

  saveValues(population: Subject[], maximization: boolean): void {
    this.saveMinMaxValue(population, maximization);
    this.saveMeanValue(population);
    this.saveStdValue(population);
  }

  clearValues(): void {
    this.best = null;
    this.bestValues = [];
    this.meanValues = [];
    this.stdValues = [];
  }

  prepareFiles(): void {
    this.dynamicDownload({
      fileName: 'Best values',
      text: this.bestValues.map(x => x.toString()).join('\n')
    });
    this.dynamicDownload({
      fileName: 'Mean values',
      text: this.meanValues.toString()
    });
    this.dynamicDownload({
      fileName: 'Std values',
      text: this.stdValues.toString()
    });
  }

  private dynamicDownload(arg: {
    fileName: string,
    text: string
  }): void {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }


}
