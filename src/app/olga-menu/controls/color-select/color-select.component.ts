import { Component, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ColorService } from '../../../services/colors.service';

@Component({
  selector: 'color-select',
  templateUrl: './color-select.component.html',
  styleUrls: ['./color-select.component.scss']
})
export class ColorSelectComponent implements OnInit, OnChanges {

  constructor(public colors: ColorService) { }
  @Input() title = '';
  @Input() variableName = '';
  @Input() color = '#000000000';
  @Output() rValue = 0;
  @Output() gValue = 0;
  @Output() bValue = 0;

  ngOnInit(): void {
  }

  protected updateRGB(): void  {
    let value = this.color.slice(1);
    if(value.length == 6) { // parse RRGGBB
      let r = value.slice(0,2);
      let g = value.slice(2,4);
      let b = value.slice(4,6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    }else if(value.length == 9){ // parse RRRGGBB
      let r = value.slice(0,2);
      let g = value.slice(2,4);
      let b = value.slice(4,6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    }else if(value.length == 12){ // parse RRRGGBBAAA
      let r = value.slice(0,2);
      let g = value.slice(2,4);
      let b = value.slice(4,6)
      this.rValue = parseInt(r, 16);
      this.gValue = parseInt(g, 16);
      this.bValue = parseInt(b, 16);
    }
    // const bigint = parseInt(c,16);
    // this.rValue = (bigint >> 16) & 255;
    // this.gValue = (bigint >> 8) & 255;
    // this.bValue = bigint & 255;
}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.color) {
      this.updateRGB();
    }
  }

  updateColor(color: string) {
    this.color = color;
    this.colors.updateColor(this.variableName, color);
  }

}
