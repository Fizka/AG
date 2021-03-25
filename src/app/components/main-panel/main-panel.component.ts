import {Component, OnInit} from '@angular/core';
import {SelectionService} from '../../service/selection.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent implements OnInit {

  rangeStart = '';
  rangeEnd = '';
  populationAmount = '';
  numberOfBits = '';
  epochsAmount = '';
  bestAndTournamentChro = '';
  ESamount = '';
  crossProbablitity = '';
  mutationProbablitity = '';
  inversionProbablility = '';
  selectionChoice = 'BEST';
  crossChoice = 'ONE POINT';
  mutationMetod = 'ONE POINT';
  methods = '';

  crossMethods = [
    {method: 'ONE POINT'},
    {method: 'TWO POINTS'},
    {method: 'THREE POINTS'},
    {method: 'HOMO'}];
  selectionMethods = [
    {method: 'BEST'},
    {method: 'ROULETTE'},
    {method: 'TOURNAMENT'}];
  mutationMethods = [
    {method: 'ONE POINT'},
    {method: 'TWO POINTS'}];

  constructor(private selectionService: SelectionService) {
  }

  ngOnInit(): void {
  }

  algorithm(){

  }

  onSubmit() {
    console.log(this.rangeStart,
      this.rangeEnd,
      this.populationAmount,
      this.numberOfBits,
      this.epochsAmount,
      this.bestAndTournamentChro,
      this.ESamount,
      this.crossProbablitity,
      this.mutationProbablitity,
      this.inversionProbablility,
      this.selectionChoice,
      this.crossChoice,
      this.mutationMetod,
      this.methods);
  }

}
