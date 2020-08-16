import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { ChessMove, GameService } from '../services/game.service';

export const SquareNames = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];

export interface Piece {
  role: string;
  color: string;
  promoted?: boolean;
}

export class BoardTheme {
  constructor(
    public tileLight: string = '',
    public tileDark: string = '',
    public pieceSet: string = '',
    public isSpriteSheet = false,
    public fileExtension = '.svg'
  ) { }
}


export class BoardSettings {

};


@Component({
  selector: 'canvas-chessboard',
  templateUrl: './canvas-chessboard.component.html',
  styleUrls: ['./canvas-chessboard.component.scss'],
})
export class CanvasChessBoard implements OnInit, AfterViewInit {
  @Input() UUID = '';
  @Input() size = 320;
  @Output() tileSize = Math.floor(this.size / 8);
  @Input() interactive = true;
  @Input() @Output() theme: BoardTheme | null = new BoardTheme();
  @Input() @Output() settings: BoardSettings | null = new BoardSettings();
  @Output() pieceMap = new Map<string, fabric.Group>();
  @Output() pieces: { tile: number; object: fabric.Group }[] = [];
  @Output() tiles: { tile: fabric.Object, piece?: Piece }[] = [];
  @Output() canvas: fabric.Canvas | null = null;
  @Output() orientation = 'white';
  @Input() @Output() selectedPiece: { tile: number; object: fabric.Group } | null = null;
  @Output() touching = false;
  constructor(public gameService: GameService) {
    this.gameService.attachBoard(this);
    if (this.gameService.game.value !== null) {
      this.setBoardToGamePosition();
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    fabric.Object.prototype.transparentCorners = false;
    this.canvas = new fabric.Canvas(this.UUID + '-canvas');
    this.canvas.selection = false;
    const waitCount = this.loadPieces();
    waitCount.subscribe((count) => {
      if (count >= 12) {
        this.generateBoard();
        this.connectMouseInput();
        this.setBoardToGamePosition();
        waitCount.unsubscribe();
      }
    });
    this.canvas.hoverCursor = 'arrow';
    this.canvas.allowTouchScrolling = true;
    this.setInteractive(this.interactive);
  }
  addPiece(tile: number, color: string, role: string) {
    const col = tile % 8;
    const row = Math.floor(tile / 8);
    const padding = Math.floor((this.size - this.tileSize * 8) / 2);
    if (role && color) {
      const pieceImage = this.pieceMap.get(color + role);
      if (pieceImage) {
        pieceImage.clone((pieceObject: fabric.Group) => {
          pieceObject.set('lockRotation', true);
          pieceObject.set('lockScalingX', true);
          pieceObject.set('lockScalingY', true);
          pieceObject.set('lockUniScaling', true);
          pieceObject.set('hasControls', false);
          pieceObject.set('hasBorders', false);
          if (!this.interactive) {
            pieceObject.set('lockMovementX', true);
            pieceObject.set('lockMovementY', true);
          } else {
            pieceObject.hoverCursor = 'grab';
            pieceObject.moveCursor = 'grabbing';
          }
          if (this.orientation == 'white') {
            pieceObject.set('left', Math.floor(col * this.tileSize) + padding);
            pieceObject.set('top', Math.floor((7 - row) * this.tileSize) + padding);
          } else {
            pieceObject.set('left', Math.floor((7 - col) * this.tileSize) + padding);
            pieceObject.set('top', Math.floor(row * this.tileSize) + padding);
          }
          pieceObject.scaleToHeight(this.tileSize);
          pieceObject.setCoords();
          this.pieces[tile] = { tile: tile, object: pieceObject };
          if (this.canvas) {
            this.canvas?.add(pieceObject);
            this.canvas?.bringToFront(pieceObject);
          }
        });
      }
    }
  }
  makeMove(move: ChessMove): void {
    if (this.pieces[move.from]) {
      const piece = this.pieces[move.from];
      delete this.pieces[move.from];
      if (piece.object) {
        const row = Math.floor(move.to / 8);
        const col = move.to % 8;
        if (this.orientation == 'white') {
          piece.object.set('left', col * this.tileSize);
          piece.object.set('top', (7 - row) * this.tileSize);
        } else {
          piece.object.set('left', (7 - col) * this.tileSize);
          piece.object.set('top', row * this.tileSize);
        }
        const to = (row * 8) + col;
        const capture = this.pieces[to];
        if (capture) {
          this.canvas?.remove(capture.object);
        }
        piece.tile = to;
        this.pieces[to] = piece;
        piece.object.setCoords();
        this.canvas?.requestRenderAll();
      }
    }
  }
  private resetMove(move: ChessMove): void {
    const piece = this.pieces[move.from].object;
    if (piece) {
      const row = Math.floor(move.from / 8);
      const col = move.from % 8;
      if (this.orientation == 'white') {
        piece.set('left', col * this.tileSize);
        piece.set('top', (7 - row) * this.tileSize);
      } else {
        piece.set('left', (7 - col) * this.tileSize);
        piece.set('top', row * this.tileSize);
      }
      piece.setCoords();
    }
  }
  // Move to just board functions
  // movePiece(to, from);
  // removePiece(tile);
  // addPiece(tile, piece);
  // clearPieces();
  // 

  checkPieceCanMove(fromData: { tile: number; object: fabric.Group; piece: Piece | undefined }, toData: { tile: number; object: fabric.Group; piece: Piece | undefined }): boolean { return true; }

  public isValidDrop(from: number, to: number): boolean {
    if (this.gameService.game.value !== null) {
      const position = this.gameService.game.value.getPosition();
      const legal = position.isMoveLegal(SquareNames[from], SquareNames[to]);
      return legal !== false;
    }
    return false;
  }

  private checkValidDrop(e: fabric.IEvent): void {
    if (this.selectedPiece?.object) {
      let x = 0;
      let y = 0;
      if (this.touching) {
        const event = e.e as TouchEvent;
        if (event.changedTouches.length) {
          x = event.changedTouches[0].clientX;
          y = event.changedTouches[0].clientY;
        }
        this.touching = false;
      } else {
        const event = e.e as MouseEvent;
        x = event.x;
        y = event.y;
      }
      let row = Math.ceil(y / this.tileSize) - 1;
      let col = Math.ceil(x / this.tileSize) - 1;
      if (this.orientation == 'white') {
        row = Math.ceil((this.size - y) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - x) / this.tileSize) - 1;
      }
      const tile = ((row * 8) + col);
      const move = new ChessMove();
      move.from = this.selectedPiece.tile;
      move.to = tile;
      if (x < 0 || x > this.size || y > this.size || y < 0) {
        this.resetMove(move);
      } else {
        if (this.isValidDrop(this.selectedPiece.tile, tile) && this.gameService.game.value !== null) {
          this.gameService.game.value.makeMove(move);
          this.makeMove(move);
        } else {
          this.resetMove(move);
        }
      }
      this.selectedPiece = null;
    }
  }

  touchStart(event: TouchEvent): void {
    if (event.touches.length) {
      const point = event.touches[0];
      let row = Math.ceil(point.clientY / this.tileSize) - 1;
      let col = Math.ceil(point.clientX / this.tileSize) - 1;
      if (this.orientation == 'white') {
        row = Math.ceil((this.size - point.clientY) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - point.clientX) / this.tileSize) - 1;
      }
      const tileIndex = ((row * 8) + col);
      if (tileIndex >= 0 && tileIndex < 64) {
        this.touching = true;
        this.selectedPiece = this.pieces[tileIndex];
        //this.highlightTile(tileIndex);
      }
    }
  }


  private selectPiece(e: fabric.IEvent): void {
    let x = 0;
    let y = 0;
    const event = e.e as MouseEvent;
    x = event.x;
    y = event.y;
    if (x === undefined || y === undefined) {
      const event = e.e as TouchEvent;
      if (event.touches.length) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      }
    }
    let row = Math.ceil(y / this.tileSize) - 1;
    let col = Math.ceil(x / this.tileSize) - 1;
    if (this.orientation == 'white') {
      row = Math.ceil((this.size - y) / this.tileSize) - 1;
    } else {
      col = Math.ceil((this.size - x) / this.tileSize) - 1;
    }
    const tileIndex = ((row * 8) + col);
    if (tileIndex >= 0 && tileIndex < 64) {
      this.selectedPiece = this.pieces[tileIndex];
      //this.highlightTile(tileIndex);
    }
  }

  private clearBoard(): void {
    this.pieces.forEach((piece) => {
      this.canvas?.remove(piece.object);
    });
    this.pieces = [];
    this.tiles.forEach((tileData) => {
      this.canvas?.remove(tileData.tile);
    });
    this.tiles = [];
  }

  public clearMaterial(): void {
    this.pieces.forEach((piece) => {
      this.canvas?.remove(piece.object);
    });
    this.pieces = [];
  }

  private connectMouseInput(): void {
    if (this.canvas) {
      this.canvas.on('object:moved', this.checkValidDrop.bind(this));
      this.canvas.on('mouse:down', this.selectPiece.bind(this));
    }
  }

  private generateTiles(): void {
    if (this.canvas) {
      if (!this.theme) {
        console.log('Cannot generate board without theme');
        return;
      }
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
          tile.set('selectable', false);
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
        }
      }
      this.tiles.forEach(this.addTile.bind(this));
    }
    this.canvas?.requestRenderAll();
  }

  private addTile(tileData: { tile: fabric.Object, piece?: Piece }) {
    if (this.canvas) {
      this.canvas.add(tileData.tile);
      this.canvas.bringToFront(tileData.tile);
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
        this.canvas
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
      this.canvas?.requestRenderAll();
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
      this.canvas?.requestRenderAll();
    } else {
      console.log('Cannot set board-canvas tile light with Null theme');
    }
  }

  setSize(size: number): void {
    if (this.canvas) {
      this.size = size;
      this.tileSize = Math.floor(size / 8);
      this.canvas.width = size;
      this.canvas.height = size;
      this.canvas.setDimensions({
        width: size,
        height: size,
      });
      this.resizeBoardObjects(size);
      this.canvas.requestRenderAll();
    }
  }

  setInteractive(interactive: boolean): void {
    if (interactive) {
      if (this.canvas) {
      }
    } else {
      if (this.canvas) {
      }
    }
  }

  setBoardToGamePosition(): void {
    this.clearMaterial();
    if (this.gameService.game.value !== null) {
      const position = this.gameService.game.value.getPosition();
      if (position) {
        for (let index = 0; index < 64; ++index) {
          const squareData = position.square(SquareNames[index]);
          // get the first and last of the role and color
          if (squareData.length >= 2) {
            this.addPiece(index, squareData[0], squareData[1].toUpperCase());
          }
        }
      }
    }
  }

  requestRedraw(): void {
    this.clearBoard();
    this.generateBoard();
  }
}
