import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { Chess } from 'chessops/chess';
import { parseFen } from 'chessops/fen';
import { ColorService } from '../../services/colors.service';
import { BehaviorSubject } from 'rxjs';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { Canvas } from 'fabric/fabric-impl';
import { Piece } from 'chessops/types';

export class BoardTheme {
  constructor(
    public tileLight: string = '',
    public tileDark: string = '',
    public pieceSet: string = '',
    public isSpriteSheet = false,
    public fileExtension = '.svg'
  ) { }
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
  ) { }
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
  @Input() interactive = true;
  @Input() @Output() theme: BoardTheme | null = new BoardTheme();
  @Input() @Output() data: BoardData | null = new BoardData();
  @Output() pieceMap = new Map<string, fabric.Group>();
  @Output() pieces: { tile: number; object: fabric.Group }[] = [];
  @Output() tiles: { tile: fabric.Object, piece?: Piece }[] = [];
  @Output() olgaBoard: fabric.Canvas | null = null;
  @Output() orientation = 'white';
  @Input() @Output() selectedPiece: { tile: number; object: fabric.Group } | null = null;
  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    fabric.Object.prototype.transparentCorners = false;
    this.olgaBoard = new fabric.Canvas(this.UUID + '-board');
    this.olgaBoard.selection = false;
    const waitCount = this.loadPieces();
    waitCount.subscribe((count) => {
      if (count >= 12) {
        this.generateBoard();
        this.connectMouseInput();
        waitCount.unsubscribe();
      }
    });
    this.olgaBoard.hoverCursor = 'arrow';
    this.setInteractive(this.interactive);
  }

  checkPieceCanMove(fromData: { tile: number; object: fabric.Group; piece: Piece | undefined }, toData: { tile: number; object: fabric.Group; piece: Piece | undefined }): boolean { return true; }

  private checkValidDrop(e: fabric.IEvent): void {
    if (this.selectedPiece?.object) {
      const event = e.e as MouseEvent;
      let row = Math.ceil(event.y / this.tileSize) - 1;
      let col = Math.ceil(event.x / this.tileSize) - 1;
      if (this.orientation == 'white') {
        row = Math.ceil((this.size - event.y) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - event.x) / this.tileSize) - 1;
      }
      const tile = ((row * 8) + col);
      const piece = this.selectedPiece.object;
      const pieceToTake = this.pieces[tile];
      if (event.x < 0 || event.x > this.size || event.y > this.size || event.y < 0) {
        row = Math.floor(this.selectedPiece.tile / 8);
        col = this.selectedPiece.tile % 8;
        if (this.orientation == 'white') {
          row = 7 - Math.floor(this.selectedPiece.tile / 8);
        } else {
          col = 7 - this.selectedPiece.tile % 8;
        }
      } else {
        if (this.checkPieceCanMove({
          tile: this.selectedPiece.tile,
          object: this.selectedPiece.object,
          piece: this.tiles[this.selectedPiece.tile].piece
        }, {
          tile: tile,
          object: pieceToTake?.object,
          piece: this.tiles[tile].piece
        })) {
          this.pieces.slice(this.selectedPiece.tile, 1);
          this.tiles[tile].piece = this.tiles[this.selectedPiece.tile].piece;
          delete this.tiles[this.selectedPiece.tile].piece;
          this.pieces[tile] = this.selectedPiece;
          this.selectedPiece.tile = tile;
        } else {
          row = Math.floor(this.selectedPiece.tile / 8);
          col = this.selectedPiece.tile % 8;
        }
      }
      if (this.orientation == 'white') {
        piece.set('left', col * this.tileSize);
        piece.set('top', (7 - row) * this.tileSize);
      } else {
        piece.set('left', (7 - col) * this.tileSize);
        piece.set('top', row * this.tileSize);
      }
      piece.setCoords();
      this.selectedPiece = null;
    }
  }

  private selectPiece(e: fabric.IEvent): void {
    const event = e.e as MouseEvent;
    let row = Math.ceil(event.y / this.tileSize) - 1;
    let col = Math.ceil(event.x / this.tileSize) - 1;
    if (this.orientation == 'white') {
      row = Math.ceil((this.size - event.y) / this.tileSize) - 1;
    } else {
      col = Math.ceil((this.size - event.x) / this.tileSize) - 1;
    }
    const tileIndex = ((row * 8) + col);
    if (tileIndex >= 0 && tileIndex < 64) {
      this.selectedPiece = this.pieces[tileIndex];
      //this.highlightTile(tileIndex);
    }
  }

  private clearBoard(): void {
    this.pieces.forEach((piece) => {
      this.olgaBoard?.remove(piece.object);
    });
    this.pieces = [];
    this.tiles.forEach((tileData) => {
      this.olgaBoard?.remove(tileData.tile);
    });
    this.tiles = [];
  }

  private connectMouseInput(): void {
    if (this.olgaBoard) {
      this.olgaBoard.on('object:moved', this.checkValidDrop.bind(this));
      this.olgaBoard.on('mouse:down', this.selectPiece.bind(this));
    }
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
            height: this.tileSize
          });
          // create piece
          if (this.orientation == 'white') {
            tile.set('left', col * this.tileSize + padding);
            tile.set('top', row * this.tileSize + padding);
          } else {
            tile.set('left', col * this.tileSize + padding);
            tile.set('top', row * this.tileSize + padding);
          }

          tile.set('lockMovementX', true);
          tile.set('lockMovementY', true);
          tile.set('lockRotation', true);
          tile.set('lockScalingX', true);
          tile.set('lockScalingY', true);
          tile.set('lockUniScaling', true);
          tile.set('hasControls', false);
          tile.set('hasBorders', false);
          tile.setCoords();
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
          this.tiles.push({ tile: tile });
          if (chess) {

            let squareData = chess.board.get(tileIndex);
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
                  clone.set('lockRotation', true);
                  clone.set('lockScalingX', true);
                  clone.set('lockScalingY', true);
                  clone.set('lockUniScaling', true);
                  clone.set('hasControls', false);
                  clone.set('hasBorders', false);
                  if (!this.interactive) {
                    clone.set('lockMovementX', true);
                    clone.set('lockMovementY', true);
                  } else {
                    clone.hoverCursor = 'grab';
                    clone.moveCursor = 'grabbing';
                  }
                  if (this.orientation == 'white') {
                    clone.set('left', Math.floor(col * this.tileSize) + padding);
                    clone.set('top', Math.floor((7 - row) * this.tileSize) + padding);
                  } else {
                    clone.set('left', Math.floor((7 - col) * this.tileSize) + padding);
                    clone.set('top', Math.floor(row * this.tileSize) + padding);
                  }
                  clone.scaleToHeight(this.tileSize);
                  clone.setCoords();
                  this.pieces[tileIndex] = { tile: tileIndex, object: clone };
                  this.tiles[tileIndex].piece = squareData;
                });
              }
            }
          }
          ++tileIndex;
        }
      }
      this.tiles.forEach((tileData) => {
        this.olgaBoard?.add(tileData.tile);
      });
      this.pieces.forEach((pieceObject) => {
        this.olgaBoard?.add(pieceObject.object);
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
        const tile = this.tiles[index].tile;
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
    this.pieces.forEach((pieceData) => {
      const piece = pieceData.object;
      if (
        piece.left !== undefined &&
        piece.top !== undefined &&
        this.olgaBoard
      ) {
        const row = Math.floor(pieceData.tile / 8);
        const col = pieceData.tile % 8;
        piece.scaleToHeight(this.tileSize);
        if (this.orientation == 'white') {
          piece.set('left', Math.floor(col * this.tileSize) + padding);
          piece.set('top', Math.floor((7 - row) * this.tileSize) + padding);
        } else {
          piece.set('left', Math.floor((7 - col) * this.tileSize) + padding);
          piece.set('top', Math.floor(row * this.tileSize) + padding);
        }
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
            const tile = this.tiles[index].tile;
            tile.set('fill', color);
          }
        } else {
          if (index % 2 !== 0) {
            const tile = this.tiles[index].tile;
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
            const tile = this.tiles[index].tile;
            tile.set('fill', color);
          }
        } else {
          if (index % 2 !== 0) {
            const tile = this.tiles[index].tile;
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
      this.size = size;
      this.tileSize = Math.floor(size / 8);
      this.olgaBoard.width = size;
      this.olgaBoard.height = size;
      this.olgaBoard.setDimensions({
        width: size,
        height: size,
      });
      this.resizeBoardObjects(size);
      this.olgaBoard.requestRenderAll();
    }
  }

  setInteractive(interactive: boolean): void {
    if (interactive) {
      if (this.olgaBoard) {
      }
    } else {
      if (this.olgaBoard) {
      }
    }
  }

  setFen(fen: string): void {
    if (this.data) {
      this.data.fen = fen;
      this.clearBoard();
      this.generateBoard();
    }
  }

  requestRedraw(): void {
    this.clearBoard();
    this.generateBoard();
  }
}
