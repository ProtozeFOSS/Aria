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
import { Role, Move, Piece } from 'chessops/types';

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
  toRole(role: string): Role {
    return role as Role;
  }
  ngAfterViewInit(): void {
    // board is legit, attach engine
    if (this.board) {
      this.board.checkPieceCanMove = this.engineService.makeMove.bind(this.engineService);
      this.engineService.boardFen.subscribe(this.setFen.bind(this));
    }
  }


  setBoardSize(size: number): void {
    this.board?.setSize(size);
  }

  setFen(fen: string): void {
    this.board?.setFen(fen);
  }

  updateBoard(change: boolean): void {
    if (this.board) {
      this.board.setFen(this.engineService.getFen());
    }
  }
}
