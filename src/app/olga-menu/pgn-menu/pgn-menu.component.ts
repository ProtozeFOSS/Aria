import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'pgn-menu',
  templateUrl: './pgn-menu.component.html',
  styleUrls: ['./pgn-menu.component.scss']
})
export class PgnMenuComponent implements OnInit {
  @ViewChild('container') container: ElementRef | null = null;
  constructor(public olga: OlgaService) { }

  ngOnInit(): void {
  }

  show(): void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
    }
  }

  hide(): void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
    }
  }
  setPGN(pgn: string) : void {
    console.log('Received PGN - ');
    console.log(pgn);
    this.olga.loadPGN(pgn);
  }
  
  public resize(width: number, height: number): void {

  }
}
