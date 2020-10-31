import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ThemeService } from '../../services/themes.service';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'gamescore-menu',
  templateUrl: './gamescore-menu.component.html',
  styleUrls: ['./gamescore-menu.component.scss'],
})
export class GamescoreMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container: ElementRef | null = null;
  constructor(public themes: ThemeService, public olga: OlgaService) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {

  }
  toggleFont(): void {
    this.olga.figurineNotation.next(!this.olga.figurineNotation.value);
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
