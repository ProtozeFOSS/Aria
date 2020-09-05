import { Component, OnInit } from '@angular/core';
import { OlgaService } from '../services/olga.service';

@Component({
  selector: 'olga-controls',
  templateUrl: './olga-controls.component.html',
  styleUrls: ['./olga-controls.component.scss']
})
export class OlgaControlsComponent implements OnInit {

  constructor(public olga: OlgaService) { }

  ngOnInit(): void {
  }

  advance(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.advance();
  }

  moveToStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.moveToStart();
  }

  previous(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.previous();
  }

  moveToEnd(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.moveToEnd();
  }
}
