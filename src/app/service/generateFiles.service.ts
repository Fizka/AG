import {Injectable} from '@angular/core';
import {Subject} from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class GenerateFilesService {

  private minimalValues: number[] = [];
  private meanValues: number[] = [];
  private stdValues: number[] = [];

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  saveValue(minValue: number): void {
    this.minimalValues.push(minValue);
  }

  saveMeanValue(population: Subject[]): void {
    this.meanValues.push(this.getMeanValue(population));
  }

  getMeanValue(population: Subject[]): number {
    let mean = 0;
    population.forEach(subject => {
      mean += subject.fitnessValue;
    });
    return mean;
  }

  saveStdValue(population: Subject[]): void {
    let value = 0;
    const mean = this.getMeanValue(population);
    population.forEach(subject => {
      value += Math.pow((subject.fitnessValue - mean), 2);
    });
    value = Math.sqrt(value / population.length);
    this.stdValues.push(value);
  }

  prepareFiles(): void {
    this.dynamicDownload({
      fileName: 'My Report1',
      text: 'blab1'
    });
    this.dynamicDownload({
      fileName: 'My Report2',
      text: 'blab2'
    });
    this.dynamicDownload({
      fileName: 'My Report3',
      text: 'blab3'
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
