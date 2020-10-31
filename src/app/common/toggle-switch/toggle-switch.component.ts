import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Input() value: BehaviorSubject<boolean> | null = null;
  @Input() off:string = '';
  @Input() on:string = '';
  public toggled: boolean = false;
  constructor() { }

  ngOnInit(): void {
    if(this.value) {
      this.toggled = this.value.value;
      this.value.subscribe((state)=>{this.toggled = state;});
    }
  }

  toggle(): void {
    if(this.value) {
      this.value.next(!this.value.value);
    }
  }

}
