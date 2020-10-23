import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '../../services/colors.service';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.scss']
})
export class GeneralMenuComponent implements OnInit {

  constructor(public olga: OlgaService, public colors: ColorService) { }
  @ViewChild('container') container: ElementRef | null = null;

  ngOnInit(): void {
    
  }

  hide():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
    }
  }
  show():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
    }
  }

  public resize(width: number, height: number): void {

  }
}
