import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
} from '@angular/core';
import { fabric } from 'fabric';
import { ColorService } from '../services/colors.service';
import { EngineService } from '../services/engine.service';
import {
  BoardCanvasComponent,
  BoardTheme,
  BoardData,
} from './board-canvas/board-canvas.component';
import { Board } from 'chessops/board';

@Component({
  selector: 'app-olga-board',
  templateUrl: './olga-board.component.html',
  styleUrls: ['./olga-board.component.scss'],
})
export class OlgaBoardComponent implements OnInit, AfterViewInit {
  @Input() UUID = '';
  @ViewChild(BoardCanvasComponent)
  board: BoardCanvasComponent | null = null;
  @Input() @Output() theme: BoardTheme | null = null;
  @ViewChild('ogBoard', { static: false }) background: ElementRef | null = null;
  constructor(
    public colorService: ColorService,
    public engineService: EngineService
  ) {
    this.engineService.boardChanged.subscribe(this.updateBoard.bind(this));
    this.theme = BoardTheme.defaultTheme(this.colorService);
    fabric.Object.prototype.objectCaching = true;
  }

  ngOnInit(): void {
    this.colorService.boardBGDark.subscribe((dark) => {
      if (this.board) {
        this.board.setDarkTile(dark);
      }
    });
    this.colorService.boardBGLight.subscribe((light) => {
      if (this.board) {
        this.board.setLightTile(light);
      }
    });
  }

  ngAfterViewInit(): void {
    // board is legit
  }

  setBoardSize(size: number): void {
    this.board?.setSize(size);
  }

  setFen(fen: string): void {
    this.board?.setFen(fen);
  }

  updateBoard(): void {}
}
