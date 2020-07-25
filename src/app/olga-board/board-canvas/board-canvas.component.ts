import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { Chess } from 'chessops/chess';
import { parseFen } from 'chessops/fen';
import { ColorService } from '../../services/colors.service';

export class BoardTheme {
  constructor(public tileLight: string = '',
    public tileDark: string = '',
    public pieceSet: string = '',
    public isSpriteSheet = false,
    public fileExtension = '.svg') { }
  static defaultTheme(cs: ColorService): BoardTheme {
    return new BoardTheme(cs.boardBGLight.value, cs.boardBGDark.value, cs.boardPieceSet.value);
  }
}

export class BoardData {
  constructor(public fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') { }
}



@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss']
})
export class BoardCanvasComponent implements OnInit, AfterViewInit {
  @Input() UUID = '';
  @Input() size = 320;
  @Output() tileSize = this.size / 8;
  @Input() @Output() theme: BoardTheme | null = new BoardTheme();
  @Input() @Output() data: BoardData | null = new BoardData();
  pieceMap: fabric.Object[] = [];
  tileGroup: fabric.Group | null = null;
  pieceGroup: fabric.Group | null = null;
  olgaBoard: fabric.Canvas | null = null;
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.olgaBoard = new fabric.Canvas(this.UUID + '-board');
    //this.generatePieces();
    this.generateBoard();
  }

  private generateBoard(): void {
    if (this.olgaBoard) {
      if (!this.theme) {
        console.log('Cannot generate board without theme');
        return;
      }
      this.olgaBoard.remove(this.tileGroup as fabric.Group);
      this.tileGroup = null;

      const tiles = [];
      const pieces = [];
      let tileIndex = 0;
      let chess = null;

      if (this.data && this.data.fen && this.pieceMap.keys.length == 0) {
        const setup = parseFen(this.data.fen).unwrap();
        chess = Chess.fromSetup(setup).unwrap();
      }
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          // move this to clone feature, only create the tiles once.
          const tile = new fabric.Rect({
            width: this.tileSize,
            height: this.tileSize,
            left: (row % 8) * this.tileSize,
            top: (col % 8) * this.tileSize,
          });
          if (row % 2 === 0) {
            // even row 0, 2, 4, 6
            if (col % 2 === 0) {
              tile.setColor(this.theme.tileDark);
            } else {
              tile.setColor(this.theme.tileLight);
            }
          } else {
            // odd row 1, 3, 5, 7
            if (col % 2 === 0) {
              tile.setColor(this.theme.tileLight);
            } else {
              tile.setColor(this.theme.tileDark);
            }
          }
          tiles.push(tile);
          if (chess) {
            const squareData = chess.board.get(tileIndex);
            // get the first and last of the role and color
            const color = squareData?.color[0].toLowerCase();
            const role = squareData?.role[0].toUpperCase();
            if (role && color) {
              let pieceImage = this.pieceMap[tileIndex];
              if (!pieceImage) {
                this.loadPieceImage(tileIndex, color + role, (col % 8) * this.tileSize, (row % 8) * this.tileSize);
              } else {
                this.olgaBoard.remove(pieceImage);
                pieceImage.left = (col % 8) * this.tileSize;
                pieceImage.top = (row % 8) * this.tileSize;
                pieceImage.scale(this.tileSize / 177);
                this.olgaBoard?.add(pieceImage);
              }
            }
          }
          ++tileIndex;
        }
      }
      this.tileGroup = new fabric.Group(tiles, {
        top: 0,
        left: 0,
      });
      this.tileGroup.lockMovementX = true;
      this.tileGroup.lockMovementY = true;
      this.olgaBoard.add(this.tileGroup);
    }
  }

  private generatePieces(): void {
    if (this.olgaBoard) {
      this.olgaBoard.remove(this.pieceGroup as fabric.Object);
      this.pieceGroup = null;
      const piece = [];
      // this.loadPieceImage('wK');
      // this.loadPieceImage('wB');
      // this.loadPieceImage('wQ');
      // this.loadPieceImage('wR');
      // this.loadPieceImage('wP');
      // this.loadPieceImage('wN');
      // this.loadPieceImage('bK');
      // this.loadPieceImage('bB');
      // this.loadPieceImage('bQ');
      // this.loadPieceImage('bR');
      // this.loadPieceImage('bP');
      // this.loadPieceImage('bN');
    }
  }

  private createPiece(pieceImage: fabric.Object, x: number, y: number): void {
    pieceImage.clone((clone: fabric.Object) => {
      clone.left = x;
      clone.top = y;
      this.olgaBoard?.add(clone);
      this.olgaBoard?.renderAll();
    });
  }

  private loadPieceImage(index: number, piece: string, x: number, y: number): void {
    if (this.theme?.pieceSet) {
      if (this.theme.isSpriteSheet) {

      } else { // load individual images
        if (this.theme.fileExtension == '.svg') { // load and cache the SVG images
          console.log('Loading ' + this.theme?.pieceSet + piece);
          fabric.loadSVGFromURL(this.theme.pieceSet + piece + this.theme.fileExtension,
            (objects, options) => {
              console.log('loaded ' + this.theme?.pieceSet + piece);
              var obj = fabric.util.groupSVGElements(objects, options);
              this.pieceMap[index] = obj;
              obj.left = x;
              obj.top = y;
              obj.scale(this.tileSize / 177);
              this.olgaBoard?.add(obj);
            });
        }
      }
    }
  }

  setDarkTile(color: string): void {
    if (this.theme) {
      this.theme.tileDark = color;
      this.generateBoard();
    } else {
      console.log('Cannot set board-canvas tile dark with Null theme');
    }
  }

  setLightTile(color: string): void {
    if (this.theme) {
      this.theme.tileLight = color;
      this.generateBoard();
    } else {
      console.log('Cannot set board-canvas tile light with Null theme');
    }
  }

  setSize(size: number) {
    if (this.olgaBoard) {
      this.size = size;
      this.tileSize = this.size / 8;
      this.olgaBoard.width = this.size;
      this.olgaBoard.height = this.size;
      this.olgaBoard.setDimensions({
        width: this.size,
        height: this.size,
      });
      // resize elements
      this.generateBoard();
    }
  }
  setFen(fen: string): void {
    // Use Chessops to generate an accurate model of the FEN.
    // generate new piece set from chessops model
  }
}
