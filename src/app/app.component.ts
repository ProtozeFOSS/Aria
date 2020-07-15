import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlgaTestComponent } from './olga-test/olga-test.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Olga2';
  @ViewChild(OlgaTestComponent)
  olga: OlgaTestComponent | null = null;
  constructor() { }
  ngAfterViewInit(): void {
    window.addEventListener("resize", (event) => {
      const boardSize = window.innerHeight - 24;
      this.olga?.setBoardSize(boardSize);
      this.olga?.setGameScoreSize(window.innerWidth - boardSize - 24);
    });
  }

  onResized( event: UIEvent): void {
    
  }
}
