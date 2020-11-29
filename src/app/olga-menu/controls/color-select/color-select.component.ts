import { Component, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ThemeService } from '../../../services/themes.service';
//import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'color-select',
  templateUrl: './color-select.component.html',
  styleUrls: ['./color-select.component.scss']
})
export class ColorSelectComponent implements OnInit, OnChanges {

  constructor(public themes: ThemeService) { }
  @Input() title = '';
  @Input() variableName = '';
  @Input() color = '#000000000';
  @Output() rValue = 0;
  @Output() gValue = 0;
  @Output() bValue = 0;

  ngOnInit(): void {
  }

  protected updateRGB(): void {
    let value = this.color.slice(1);
    if (value.length == 6) { // parse RRGGBB
      let r = value.slice(0, 2);
      let g = value.slice(2, 4);
      let b = value.slice(4, 6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    } else if (value.length == 9) { // parse RRRGGBB
      let r = value.slice(0, 2);
      let g = value.slice(2, 4);
      let b = value.slice(4, 6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    } else if (value.length == 12) { // parse RRRGGBBAAA
      let r = value.slice(0, 2);
      let g = value.slice(2, 4);
      let b = value.slice(4, 6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color) {
      this.updateRGB();
    }
  }

  updateColor(color: string) {
    this.color = color;
    this.themes.updateColor(this.variableName, color);
  }

  changeComplete($event: ColorEvent) {
    console.log($event.color);
  }

}
