import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'value-slider',
  templateUrl: './value-slider.component.html',
  styleUrls: ['./value-slider.component.scss']
})
export class ValueSliderComponent implements OnInit {
  @Input() max:number = 100;
  @Input() minimum:number = 0;
  @Input() step:number = 1;
  @Input() value: number = 50;
  constructor() { }

  ngOnInit(): void {
  }

}
