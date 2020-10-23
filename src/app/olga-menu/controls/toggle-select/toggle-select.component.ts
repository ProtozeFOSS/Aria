import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'toggle-select',
  templateUrl: './toggle-select.component.html',
  styleUrls: ['./toggle-select.component.scss']
})
export class ToggleSelectComponent implements OnInit{
  @Input() title = '';
  @Input() thumbnail = '';
  @Input() value: BehaviorSubject<boolean> | null = null;

  constructor() { }

  ngOnInit(): void {

  }

}
