import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class GenerateFilesService {

  private bestSubject: Subject;

  private bestValues: number[] = [];
  private meanValues: number[] = [];
  private stdValues: number[] = [];

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  private saveMinMaxValue(population: Subject[], maximization: boolean): void {
    const best = population.reduce((prev, current) => {
      return ((prev.fitnessValue > current.fitnessValue) && maximization) ? prev : current;
    });
    this.bestSubject = best;
    this.bestValues.push(best.fitnessValue);
  }

  private getMeanValue(population: Subject[]): number {
    let mean = 0;
    population.forEach(subject => {
      mean += subject.fitnessValue;
    });
    return mean;
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
