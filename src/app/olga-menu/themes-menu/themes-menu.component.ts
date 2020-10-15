import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '../../services/colors.service';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'themes-menu',
  templateUrl: './themes-menu.component.html',
  styleUrls: ['./themes-menu.component.scss']
})
export class ThemesMenuComponent implements OnInit {

  @ViewChild('container') container: ElementRef | null = null;
  constructor(public colors: ColorService, public olga: OlgaService) { }

  ngOnInit(): void {

  }

  hide():void {
    if(this.olga) {
      this.olga.reRenderBoard();
    }
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
    }
  }

  show(): void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
    }
  }

  public resize(width: number, height: number): void {

  }
}
