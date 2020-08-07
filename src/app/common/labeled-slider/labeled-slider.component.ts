import { Component, OnInit, Input } from '@angular/core';
import { } from '@angular/material/slider';
@Component({
  selector: 'app-labeled-slider',
  templateUrl: './labeled-slider.component.html',
  styleUrls: ['./labeled-slider.component.scss']
})
export class LabeledSliderComponent implements OnInit {
  @Input() value = 18;
  @Input() minimum = 14;
  @Input() maximum = 24;
  @Input() step = 1;
  @Input() label = 'labeled slider';

  constructor() { }

  ngOnInit(): void {

  }

  inputEventCapture(event: any): void {
    //console.log(event);
  }

}
