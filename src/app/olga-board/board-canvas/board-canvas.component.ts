import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { Chess } from 'chessops/chess';
import { parseFen } from 'chessops/fen';
import { ColorService } from '../../services/colors.service';
import { BehaviorSubject } from 'rxjs';
import { preserveWhitespacesDefault } from '@angular/compiler';

export class BoardTheme {
  constructor(
    public tileLight: string = '',
    public tileDark: string = '',
    public pieceSet: string = '',
    public isSpriteSheet = false,
    public fileExtension = '.svg'
  ) {}
  static defaultTheme(cs: ColorService): BoardTheme {
    return new BoardTheme(
      cs.boardBGLight.value,
      cs.boardBGDark.value,
      cs.boardPieceSet.value
    );
  }
}

export class BoardData {
  constructor(
    public fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  ) {}
}

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss'],
})
export class BoardCanvasComponent implements OnInit, AfterViewInit {
  @Input() UUID = '';
  @Input() size = 320;
  @Output() tileSize = Math.floor(this.size / 8);
  @Input() @Output() theme: BoardTheme | null = new BoardTheme();
  @Input() @Output() data: BoardData | null = new BoardData();
  pieceMap = new Map<string, fabric.Group>();
  pieces: { tile: number; piece: fabric.Group }[] = [];
  tiles: fabric.Object[] = [];
  olgaBoard: fabric.Canvas | null = null;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.olgaBoard = new fabric.Canvas(this.UUID + '-board');
    const waitCount = this.loadPieces();
    waitCount.subscribe((count) => {
      if (count >= 12) {
        this.generateBoard();
        waitCount.unsubscribe();
      }
    });
  }

  private clearBoard(): void {
    this.pieces.forEach((object) => {
      this.olgaBoard?.remove(object.piece);
    });
    this.pieces = [];
    this.tiles.forEach((tile) => {
      this.olgaBoard?.remove(tile);
    });
    this.tiles = [];
  }

  private generateTiles(): void {
    if (this.olgaBoard) {
      if (!this.theme) {
        console.log('Cannot generate board without theme');
        return;
      }

      let chess = null;

      if (this.data && this.data.fen) {
        const setup = parseFen(this.data.fen).unwrap();
        chess = Chess.fromSetup(setup).unwrap();
      }
      let tileIndex = 0;
      const padding = Math.floor((this.size - this.tileSize * 8) / 2);
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          // move this to clone feature, only create the tiles once.
          const tile = new fabric.Rect({
            width: this.tileSize,
            height: this.tileSize,
            left: (row % 8) * this.tileSize + padding,
            top: (col % 8) * this.tileSize + padding,
          });
          // create piece
          tile.set('lockMovementX', true);
          tile.set('lockMovementY', true);
          tile.set('lockRotation', true);
          tile.set('selectable', false);
          tile.set('lockScalingX', true);
          tile.set('lockScalingY', true);
          tile.set('lockUniScaling', true);
          tile.set('hasControls', false);
          tile.set('hasBorders', false);

          if (chess) {
            const squareData = chess.board.get(tileIndex);
            // get the first and last of the role and color
            const color = squareData?.color[0].toLowerCase();
            let role = squareData?.role[0].toUpperCase();
            if (squareData?.role === 'knight') {
              role = 'N';
            }
            if (role && color) {
              const pieceImage = this.pieceMap.get(color + role);
              if (pieceImage) {
                pieceImage.clone((clone: fabric.Group) => {
                  clone.left = Math.floor((col % 8) * this.tileSize) + padding;
                  clone.top = Math.floor((row % 8) * this.tileSize) + padding;
                  clone.set('lockRotation', true);
                  clone.set('lockScalingX', true);
                  clone.set('lockScalingY', true);
                  clone.set('lockUniScaling', true);
                  clone.set('hasControls', false);
                  clone.set('hasBorders', false);
                  clone.scaleToHeight(this.tileSize);
                  this.pieces.push({ tile: tileIndex, piece: clone });
                });
              }
            }
          }
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
          this.tiles.push(tile);
          ++tileIndex;
        }
      }
      this.tiles.forEach((tile) => {
        this.olgaBoard?.add(tile);
      });
      this.pieces.forEach((pieceObject) => {
        this.olgaBoard?.add(pieceObject.piece);
      });
    }
  }

  private loadPieces(): BehaviorSubject<number> {
    const count = new BehaviorSubject<number>(0);
    this.loadPieceImage('wK', count);
    this.loadPieceImage('wB', count);
    this.loadPieceImage('wQ', count);
    this.loadPieceImage('wR', count);
    this.loadPieceImage('wP', count);
    this.loadPieceImage('wN', count);
    this.loadPieceImage('bK', count);
    this.loadPieceImage('bB', count);
    this.loadPieceImage('bQ', count);
    this.loadPieceImage('bR', count);
    this.loadPieceImage('bP', count);
    this.loadPieceImage('bN', count);
    return count;
  }

  private generateBoard(): void {
    this.clearBoard();
    this.generateTiles();
  }

  private loadPieceImage(
    piece: string,
    subject: BehaviorSubject<number>
  ): void {
    if (this.theme?.pieceSet) {
      if (this.theme.isSpriteSheet) {
      } else {
        if (this.theme.fileExtension === '.svg') {
          fabric.loadSVGFromURL(
            this.theme.pieceSet + piece + this.theme.fileExtension,
            (objects, options) => {
              console.log('loaded ' + this.theme?.pieceSet + piece);
              const obj = fabric.util.groupSVGElements(
                objects,
                options
              ) as fabric.Group;
              obj.left = -400;
              obj.top = 0;
              this.pieceMap.set(piece, obj);
              subject.next(subject.value + 1);
            }
          );
        }
      }
    }
  }

  private resizeBoardObjects(size: number): void {
    const padding = Math.floor((this.size - this.tileSize * 8) / 2);
    if (this.tiles.length > 0) {
      for (let index = 0; index < 64; index++) {
        const tile = this.tiles[index];
        const row = Math.floor(index / 8);
        const col = index % 8;
        tile.set('width', this.tileSize);
        tile.set('height', this.tileSize);
        tile.set('top', row * this.tileSize + padding);
        tile.set('left', col * this.tileSize + padding);
        tile.setCoords();
      }
    }

    const difference = Math.floor(size - this.size) / 2;
    this.pieces.forEach((object) => {
      const piece = object.piece;
      if (
        piece.left !== undefined &&
        piece.top !== undefined &&
        this.olgaBoard
      ) {
        const row = Math.floor(object.tile / 8);
        const col = object.tile % 8;
        piece.scaleToHeight(this.tileSize);
        piece.set('top', row * this.tileSize + padding);
        piece.set('left', col * this.tileSize + padding);
        piece.setCoords();
      }
    });
  }

  setDarkTile(color: string): void {
    if (this.theme) {
      this.theme.tileDark = color;
      for (let index = 0; index < 64; index++) {
        const row = Math.floor(index / 8);
        if (row % 2 === 0) {
          if (index % 2 === 0) {
            const tile = this.tiles[index];
            tile.set('fill', color);
          }
        } else {
          if (index % 2 !== 0) {
            const tile = this.tiles[index];
            tile.set('fill', color);
          }
        }
      }
      this.olgaBoard?.requestRenderAll();
    } else {
      console.log('Cannot set board-canvas tile dark with Null theme');
    }
  }

  setLightTile(color: string): void {
    if (this.theme) {
      this.theme.tileLight = color;
      for (let index = 0; index < 64; index++) {
        const row = Math.floor(index / 8);
        if (row % 2 !== 0) {
          if (index % 2 === 0) {
            const tile = this.tiles[index];
            tile.set('fill', color);
          }
        } else {
          if (index % 2 !== 0) {
            const tile = this.tiles[index];
            tile.set('fill', color);
          }
        }
      }
      this.olgaBoard?.requestRenderAll();
    } else {
      console.log('Cannot set board-canvas tile light with Null theme');
    }
  }

  setSize(size: number): void {
    if (this.olgaBoard) {
      this.tileSize = Math.floor(size / 8);
      this.olgaBoard.width = size;
      this.olgaBoard.height = size;
      this.olgaBoard.setDimensions({
        width: size,
        height: size,
      });
      this.resizeBoardObjects(size);
      this.size = size;

      this.olgaBoard.requestRenderAll();
    }
  }
  setFen(fen: string): void {
    if (this.data) {
      this.data.fen = fen;
      this.clearBoard();
      this.generateBoard();
    }
  }
}
