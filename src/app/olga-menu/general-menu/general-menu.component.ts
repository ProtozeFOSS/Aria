import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/themes.service';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.scss']
})
export class GeneralMenuComponent implements OnInit {

  constructor(public olga: OlgaService, public themes: ThemeService) { }
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
