import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { ColorService } from '../services/colors.service';
@Component({
  selector: 'app-olga-board',
  templateUrl: './olga-board.component.html',
  styleUrls: ['./olga-board.component.scss']
})
export class OlgaBoardComponent implements OnInit, AfterViewInit {
  constructor( public colorService: ColorService ) { }
  name = 'OlgaBoard';
  UUID = 10231;
  @Input() boardSize: number = 320;
  @Output() tileSize = this.boardSize/8;
  olgaBoard: fabric.Canvas | null = null;
  tileGroup: fabric.Group | null = null;
  @ViewChild("ogBoard", {static: false}) background: ElementRef | null = null;

  ngOnInit(): void {
    this.colorService.boardBGDark.subscribe(this.generateBoard.bind(this));
    this.colorService.boardBGLight.subscribe(this.generateBoard.bind(this));
  }

  ngAfterViewInit(): void {
    if(this.background) {
      this.olgaBoard = new fabric.Canvas('c');
      this.generateBoard();
    }

    //   const config =  {
    //     orientation: 'white',
    //     coordinates: true,

    //     draggable: {
    //         enabled: true,        // allow moves & premoves to use drag'n drop
    //         distance: 3,          // minimum distance to initiate a drag, in pixels
    //         squareTarget: false,  // display big square target; intended for mobile
    //         centerPiece: true,    // center the piece on cursor at drag start
    //         showGhost: true,      // show ghost of piece being dragged
    //     },
    //     drawable: {
    //         enabled: true,
    //         //onChange: this.onChangeDrawable
    //         // enable SVG circle and arrow drawing on the board
    //     },
    //     events: {
    //         //change: this.onChange,   // called after the situation changes on the board
    //         // called after a piece has been moved.
    //         // capturedPiece is null or like {color: 'white', 'role': 'queen'}
    //         //move: this.onMove,
    //         //select: this.onSelect // called when a square is selected
    //     },
    //     movable: {
    //         free: true,           // all moves are valid - board editor
    //         color: "both",        // color that can move. "white" | "black" | "both" | null
    //         dropOff: "trash"    // when a piece is dropped outside the board. "revert" | "trash"
    //     }

    // }  as Config;
    // this.cg = Chessground(this.chessBoard.nativeElement, config);
    // var ctx = this.background?.nativeElement.getContext("2d");
    // for( let row = 0; row < 8; row++){
    //   for ( let col = 0; col < 8; col++) {
    //   if(row % 2 == 0) { // even row 0, 2, 4, 6
    //     if(col % 2 == 0) {
    //       ctx.fillStyle = this.dark;
    //     } else {
    //       ctx.fillStyle = this.light;
    //     }
    //   }else { // odd row 1, 3, 5, 7
    //     if(col % 2 == 0) {
    //       ctx.fillStyle = this.light;
    //     } else {
    //       ctx.fillStyle = this.dark;
    //     }
    //   }
    //   ctx.fillRect(col * this.cellSize , row * this.cellSize, this.cellSize, this.cellSize);
    //   }
    // }
  
  }

  private generateBoard(): void {
    if(this.olgaBoard) {
      this.olgaBoard.remove(this.tileGroup as fabric.Object);
      this.tileGroup = null;
      let tiles = [];
      for(let row = 0; row < 8; row++) {
        for(let col = 0; col < 8; col++) {
          let tile = new fabric.Rect({
            width: this.tileSize,
            height: this.tileSize,
            left: (row % 8 ) *this.tileSize,
            top:  ((col % 8) * this.tileSize)
          });
          
          if(row % 2 == 0) { // even row 0, 2, 4, 6
            if(col % 2 == 0) {
              tile.setColor(this.colorService.boardBGDark.value);
              tile.borderColor = 'black';
            } else {
              tile.setColor(this.colorService.boardBGLight.value);
              tile.borderColor = 'black';
            }
          }else { // odd row 1, 3, 5, 7
            if(col % 2 == 0) {
              tile.setColor(this.colorService.boardBGLight.value);
              tile.borderColor = 'black';
            } else {
              tile.setColor(this.colorService.boardBGDark.value);
              tile.borderColor = 'black';
            }
          }
          tiles.push(tile);
        }
      }
      this.tileGroup = new fabric.Group(tiles, {
        top: 0,
        left: 0
      });
      this.tileGroup.lockMovementX = true;
      this.tileGroup.lockMovementY = true;
      this.olgaBoard.add(this.tileGroup);
    }
  }
  setSize(size: number) {
    if(this.olgaBoard) {
      this.boardSize = size;
      this.tileSize = this.boardSize / 8;
      this.olgaBoard.width = this.boardSize;
      this.olgaBoard.height = this.boardSize;
      this.olgaBoard.setDimensions({width: this.boardSize, height: this.boardSize});
      // resize elements
      this.generateBoard();
    }
  }
}
