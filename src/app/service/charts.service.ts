import {Injectable} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Label} from 'ng2-charts';
import {GenerateFilesService} from './generateFiles.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  public static readonly signatures = ['Best Values', 'STD Values', 'Mean Values'];

  public lineChartDataSTD: ChartDataSets[] = [
    {data: this.filesService.stdValues, label: ChartsService.signatures[1]},
  ];
  public lineChartDataMean: ChartDataSets[] = [
    {data: this.filesService.meanValues, label: ChartsService.signatures[2]},
  ];

  constructor(private filesService: GenerateFilesService) {
  }

  labels(epoch): Label[] {
    let label: Label[] = [];
    let max = 1;
    let firstLabel = epoch * 0.2;
    let secondLabel = epoch * 0.4;
    let threeLabel = epoch * 0.6;
    let fourthLabel = epoch * 0.8;

    while (max != epoch) {
      if (max == 1) {
        label.push('0');
      } else if (max == firstLabel) {
        label.push(firstLabel.toString());
      } else if (max == secondLabel) {
        label.push(secondLabel.toString());
      } else if (max == threeLabel) {
        label.push(threeLabel.toString());
      } else if (max == fourthLabel) {
        label.push(fourthLabel.toString());
      } else {
        label.push(' ');
      }
      max++;
    }
    label.push(epoch.toString());
    return label;
  }

}
