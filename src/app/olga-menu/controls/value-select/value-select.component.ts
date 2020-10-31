import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'value-select',
  templateUrl: './value-select.component.html',
  styleUrls: ['./value-select.component.scss']
})
export class ValueSelectComponent implements OnInit {
  @Input() max: number = 100;
  @Input() minimum: number = 0;
  @Input() thumbnail:string = '';
  @Input() value: BehaviorSubject<number> | null = null;
  @Input() title:string = 'title';
  constructor() { }

  ngOnInit(): void {
  }
  updateValue(event: Event): void {
    if(this.value) {
      //@ts-ignore
      const v = event.target.value;
      this.value.next(parseInt(v));
    }
  }
}
