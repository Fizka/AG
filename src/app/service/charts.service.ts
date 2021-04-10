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
    while (max != epoch) {
      let d = max - 1;
      label.push(d.toString());
      max++;
    }
    label.push(epoch.toString());
    return label;
  }

}
