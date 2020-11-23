import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { ChessMove } from '../common/kokopu-engine';
import { ThemeService } from '../services/themes.service';
import { OlgaService } from '../services/olga.service';
import { LabelState, BoardTheme, BoardSettings, Piece, SquareNames, Color } from './types';

export type Coordinate = {x: number, y: number};

enum ObjectType {
  Tile = 111,
  Label = 222
}

@Component({
  selector: 'canvas-chessboard',
  templateUrl: './canvas-chessboard.component.html',
  styleUrls: ['./canvas-chessboard.component.scss'],
})
export class CanvasChessBoard implements OnInit, AfterViewInit {
  @Input() size = 320;
  @Input() @Output() tileSize = Math.floor(this.size / 8);
  @Input() interactive = true;
  @Input() showLabels = false;
  @Input() boardID: string = '';
  protected promotionDialog: fabric.Group | null = null;
  protected knightButton: fabric.Group | null = null;
  protected bishopButton: fabric.Group | null = null;
  protected rookButton: fabric.Group | null = null;
  protected queenButton: fabric.Group | null = null;
  protected pieceAnimation: { piece: fabric.Group, x: number, y: number } | null = null;
  @Input() @Output() theme: BoardTheme = new BoardTheme();
  @Input() @Output() settings: BoardSettings = new BoardSettings();
  @Output() pieceMap = new Map<string, fabric.Group>();
  @Output() pieces: { tile: number; object: fabric.Group }[] = [];
  @Output() background: fabric.Rect | null = null;
  @Output() tileGroup: fabric.Group | null = null;
  @Output() tiles: { tile: fabric.Object; piece?: Piece }[] = [];
  @Output() labels: fabric.Object[] = [];
  @Output() canvas: fabric.Canvas | null = null;

  readonly labelState = new BehaviorSubject<LabelState>(LabelState.LeftBottom);
  @Input() @Output() selectedPiece: {
    tile: number;
    object: fabric.Group;
  } | null = null;
  @Output() touching = false;
  @Output() midPromotion = false;

  @ViewChild('boardCanvas', {static: false}) boardCanvas: ElementRef | null = null;
  constructor(
    public olga: OlgaService,
    public themes: ThemeService
  ) {}



  // initialization
  ngOnInit(): void { }

  ngAfterViewInit(): void {
    fabric.Object.prototype.transparentCorners = false;
    if(this.boardCanvas) { 
      this.canvas = new fabric.Canvas(this.boardCanvas.nativeElement);
      this.canvas.selection = false;
      const waitCount = this.loadPieces();
      waitCount.subscribe((count) => {
        if (count >= 12) {
          this.generateBoard();
          this.connectMouseInput();
          const position = this.olga.getGame()?.getPosition();
          if(position) {
            this.setBoardToPosition(position);
          }
          waitCount.unsubscribe();
          this.resizeBoardObjects(this.size);
        }
      });
      this.canvas.hoverCursor = 'arrow';
      this.canvas.allowTouchScrolling = true;
      this.setInteractive(this.interactive);
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
    this.generateBoardObjects();
    const position = this.olga.getGame()?.getPosition();
    if(position) {
      this.setBoardToPosition(position);
    }
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
              obj.moveTo(10);
              this.pieceMap.set(piece, obj);
              subject.next(subject.value + 1);
            }
          );
        }
      }
    }
  }


  // Piece Animation
  protected updatePiece() {
    if (this.pieceAnimation) {
      const piece = this.pieceAnimation.piece;
      if (piece) {
        const xC = piece.get('left');
        let xN = (xC ? xC : 0);
        if (xC && xC != this.pieceAnimation.x) {
          let increment = this.tileSize * .2;
          if (Math.abs(this.pieceAnimation.x - xC) < increment) {
            increment = this.pieceAnimation.x - xC;
          } else if (this.pieceAnimation.x < xC) {
            increment *= -1;
          }
          xN = xC + increment;
          piece.set('left', xN);
        }
        const yC = piece.get('top');
        let yN = (yC ? yC : 0);
        if (yC && yC != this.pieceAnimation.y) {
          let increment = this.tileSize * .2;
          if (Math.abs(this.pieceAnimation.y - yC) < increment) {
            increment = this.pieceAnimation.y - yC;
          } else if (this.pieceAnimation.y < yC) {
            increment *= -1;
          }
          yN = yC + increment;
          piece.set('top', yN);
        }
        piece.setCoords();
        this.canvas?.requestRenderAll();
        if (yN != this.pieceAnimation.y || xN != this.pieceAnimation.x) {
          window.setTimeout(this.updatePiece.bind(this), 12);
        } else {
          this.pieceAnimation = null;
        }
      }
    }
  }

  protected startMoveAnimation(piece: fabric.Group, x: number, y: number): void {
    if (this.pieceAnimation) {
      const lastPiece = this.pieceAnimation.piece;
      lastPiece?.set('left', this.pieceAnimation.x);
      lastPiece?.set('top', this.pieceAnimation.y);
      lastPiece.setCoords();
    }
    this.pieceAnimation = { piece, x, y };
    this.updatePiece();
  }


  protected performPromotion(move: ChessMove): void {
    if (move.promotion) {
      console.log('Promoting to ' + move.promotion.role);
      console.log('@ ' + SquareNames[move.to]);
      // remove old piece
      this.removePiece(move.from);
      this.addPiece(move.to, move.color, move.promotion.role);
      this.olga.performPromotion(move);
      this.closePromotionDialog();
    }
  }

  protected closePromotionDialog() {
    if (this.knightButton) {
      this.canvas?.remove(this.knightButton);
    }
    if (this.bishopButton) {
      this.canvas?.remove(this.bishopButton);
    }
    if (this.rookButton) {
      this.canvas?.remove(this.rookButton);
    }
    if (this.queenButton) {
      this.canvas?.remove(this.queenButton);
    }
    if (this.promotionDialog) {
      this.canvas?.remove(this.promotionDialog);
    }
    this.knightButton = null;
    this.bishopButton = null;
    this.rookButton = null;
    this.queenButton = null;
    this.promotionDialog = null;
  }

  

  protected createPromotionDialog(move: ChessMove) {
    // pull items out of chess move
    const tileIndex = move.to;
    if (move.role && move.color && tileIndex >= 0 && tileIndex < 64) {
      const group = [];

      if (this.settings.orientation == 'white') {
        // translate tileIndex
      }
      // Create the background overlay (semi-transparent square)
      const overlay = new fabric.Rect({
        width: this.size,
        height: this.size,
        left: 0,
        top: 0,
      });
      overlay.set('lockMovementX', true);
      overlay.set('lockMovementY', true);
      overlay.set('lockRotation', true);
      overlay.set('lockScalingX', true);
      overlay.set('lockScalingY', true);
      overlay.set('lockUniScaling', true);
      overlay.set('hasControls', false);
      overlay.set('hasBorders', false);
      overlay.set('selectable', false);
      overlay.set('opacity', 0.65);
      overlay.setCoords();
      overlay.setColor('#0a0a0a');
      group.push(overlay);

      // Create the background square (rounded rectangle 80% width 64% height vertically and horizontally centered)
      const height = 0.6 * this.size;
      const width = 0.8 * this.size;

      const bg = new fabric.Rect({
        height: height,
        width: width,
        fill: this.themes.bgMenu,
        left: (this.size - width) / 2,
        top: (this.size - height) / 2,
        rx: width * 0.02,
        ry: width * 0.02,
      });
      bg.setColor(this.themes.bgMenu);
      bg.set('lockMovementX', true);
      bg.set('lockMovementY', true);
      bg.set('lockRotation', true);
      bg.set('lockScalingX', true);
      bg.set('lockScalingY', true);
      bg.set('lockUniScaling', true);
      bg.set('hasControls', false);
      bg.set('hasBorders', false);
      bg.set('selectable', false);
      bg.set('strokeWidth', 1);
      bg.set('stroke', 'white');
      bg.setCoords();
      group.push(bg);
      let pieceImage = null;
      // Create the title text "Promotion" - white, subtle
      const title = new fabric.Text('Promotion', {
        fontWeight: '100',
        fontSize: this.size * 0.07,
        fontFamily: 'Courier New',
      });
      title.set('lockMovementX', true);
      title.set('lockMovementY', true);
      title.set('lockRotation', true);
      title.set('lockScalingX', true);
      title.set('lockScalingY', true);
      title.set('lockUniScaling', true);
      title.set('hasControls', false);
      title.set('hasBorders', false);
      title.set('selectable', false);
      title.setColor('white');
      title.set('originX', 'center');
      title.set('originY', 'center');
      title.set('left', this.size * 0.5);
      title.set('top', this.size * 0.235);
      title.setCoords();
      group.push(title);
      // Clone the promoted piece and tile and display them horizontally centered below title
      let x = this.size / 2;
      let y = this.size * 0.38 + 4;
      const tileSize = this.size * 0.2;
      // Tile Clone
      const tileToClone = this.tiles[tileIndex];
      if (tileToClone) {
        tileToClone.tile.clone((promotionTile: fabric.Object) => {
          promotionTile.set('top', y);
          promotionTile.set('left', x);
          promotionTile.set('originX', 'center');
          promotionTile.set('originY', 'center');
          promotionTile.scaleToHeight(tileSize);
          promotionTile.setCoords();
          group.push(promotionTile);
        });
        pieceImage = this.pieceMap.get(move.color + move.role);
        if (pieceImage) {
          pieceImage.clone((pieceObject: fabric.Group) => {
            pieceObject.set('originX', 'center');
            pieceObject.set('originY', 'center');
            pieceObject.set('top', y);
            pieceObject.set('left', x);
            pieceObject.scaleToHeight(tileSize);
            pieceObject.setCoords();
            group.push(pieceObject);
          });
        }
      }
      pieceImage = null;
      // Create text "{Color} has triggered at " below tile and piece clone
      // Create the title text "Promotion" - white, subtle
      let color = 'White';
      if (move.color === 'b') {
        color = 'Black';
      }
      const prompt = new fabric.Text(color + ' has triggered promotion at', {
        fontSize: this.size * 0.04,
      });
      prompt.set('lockMovementX', true);
      prompt.set('lockMovementY', true);
      prompt.set('lockRotation', true);
      prompt.set('lockScalingX', true);
      prompt.set('lockScalingY', true);
      prompt.set('lockUniScaling', true);
      prompt.set('hasControls', false);
      prompt.set('hasBorders', false);
      prompt.set('selectable', false);
      prompt.setColor('white');
      prompt.set('originX', 'center');
      prompt.set('originY', 'center');
      prompt.set('left', this.size * 0.5 - 24);
      prompt.set('top', this.size * 0.53);
      prompt.setCoords();
      group.push(prompt);

      // Create text to right of triggered text with move
      const atText = new fabric.Text(SquareNames[tileIndex], {
        fontSize: this.size * 0.055,
      });
      atText.set('lockMovementX', true);
      atText.set('lockMovementY', true);
      atText.set('lockRotation', true);
      atText.set('lockScalingX', true);
      atText.set('lockScalingY', true);
      atText.set('lockUniScaling', true);
      atText.set('hasControls', false);
      atText.set('hasBorders', false);
      atText.set('selectable', false);
      const bgColor = tileToClone.tile.get('fill');
      atText.setColor(bgColor ? bgColor.toString() : 'white');
      atText.set('originX', 'center');
      atText.set('originY', 'center');
      const promptWidth = prompt.get('width');
      const promptLeft = prompt.get('left');

      atText.set(
        'left',
        (promptLeft ? promptLeft : this.size * 0.2) +
        (promptWidth !== undefined ? promptWidth : 20) / 2 +
        this.size * 0.035
      );
      atText.set('top', this.size * 0.53);
      atText.setCoords();
      group.push(atText);
      // Create 4 clones of tiles, 4 clones of pieces (Knight, Bishop, Rook, And King)

      // Create the four tiles
      y = this.size * 0.67 + 4;
      x = this.size * 0.205;
      const choiceSize = tileSize * 0.75;
      if (tileToClone) {
        let buttonGroup: fabric.Object[] = [];
        tileToClone.tile.clone((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.themes.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup.push(tile);
        });

        // Knight button
        pieceImage = this.pieceMap.get(move.color + 'N');
        if (pieceImage) {
          pieceImage.clone((obj: fabric.Group) => {
            obj.set('originX', 'left');
            obj.set('originY', 'top');
            obj.set('top', 0);
            obj.set('left', 0);
            obj.scaleToHeight(choiceSize);
            obj.setCoords();
            buttonGroup.push(obj);
          });
        }
        if (buttonGroup.length >= 2) {
          this.knightButton = new fabric.Group(buttonGroup);
          this.knightButton.set('originX', 'center');
          this.knightButton.set('originY', 'center');
          this.knightButton.set('top', y);
          this.knightButton.set('left', x);
          this.knightButton.set('selectable', true);
          this.knightButton.set('lockMovementX', true);
          this.knightButton.set('lockMovementY', true);
          this.knightButton.set('lockRotation', true);
          this.knightButton.set('lockScalingX', true);
          this.knightButton.set('lockScalingY', true);
          this.knightButton.set('lockUniScaling', true);
          this.knightButton.set('hasControls', false);
          this.knightButton.set('hasBorders', false);
          this.knightButton.scaleToHeight(choiceSize);
          this.knightButton.setCoords();
          this.knightButton.on('selected', () => {
            move.promotion = { role: 'N' };
            this.performPromotion(move);
          });
        }
        let buttonGroup2: fabric.Object[] = [];
        // Bishop Button
        x = this.size * 0.4;
        tileToClone.tile.clone((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.themes.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup2.push(tile);
        });
        pieceImage = this.pieceMap.get(move.color + 'B');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup2.push(piece);
          });
        }
        if (buttonGroup2.length >= 2) {
          this.bishopButton = new fabric.Group(buttonGroup2);
          this.bishopButton.set('originX', 'center');
          this.bishopButton.set('originY', 'center');
          this.bishopButton.set('top', y);
          this.bishopButton.set('left', x);
          this.bishopButton.set('selectable', true);
          this.bishopButton.set('lockMovementX', true);
          this.bishopButton.set('lockMovementY', true);
          this.bishopButton.set('lockRotation', true);
          this.bishopButton.set('lockScalingX', true);
          this.bishopButton.set('lockScalingY', true);
          this.bishopButton.set('lockUniScaling', true);
          this.bishopButton.set('hasControls', false);
          this.bishopButton.set('hasBorders', false);
          this.bishopButton.scaleToHeight(choiceSize);
          this.bishopButton.setCoords();
          this.bishopButton.on('selected', () => {
            move.promotion = { role: 'B' };
            this.performPromotion(move);
          });
        }

        // Rook Button
        x = this.size * 0.595;
        let buttonGroup3: fabric.Object[] = [];
        tileToClone.tile.clone((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.themes.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup3.push(tile);
        });
        pieceImage = this.pieceMap.get(move.color + 'R');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup3.push(piece);
          });
        }
        if (buttonGroup3.length >= 2) {
          this.rookButton = new fabric.Group(buttonGroup3);
          this.rookButton.set('originX', 'center');
          this.rookButton.set('originY', 'center');
          this.rookButton.set('top', y);
          this.rookButton.set('left', x);
          this.rookButton.set('selectable', true);
          this.rookButton.set('lockMovementX', true);
          this.rookButton.set('lockMovementY', true);
          this.rookButton.set('lockRotation', true);
          this.rookButton.set('lockScalingX', true);
          this.rookButton.set('lockScalingY', true);
          this.rookButton.set('lockUniScaling', true);
          this.rookButton.set('hasControls', false);
          this.rookButton.set('hasBorders', false);
          this.rookButton.scaleToHeight(choiceSize);
          this.rookButton.setCoords();
          this.rookButton.on('selected', () => {
            move.promotion = { role: 'R' };
            this.performPromotion(move);
          });
        }
        // Queen
        x = this.size * 0.79;
        let buttonGroup4: fabric.Object[] = [];
        tileToClone.tile.clone((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.themes.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup4.push(tile);
        });
        pieceImage = this.pieceMap.get(move.color + 'Q');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup4.push(piece);
          });
        }
        if (buttonGroup4.length >= 2) {
          this.queenButton = new fabric.Group(buttonGroup4);
          this.queenButton.set('originX', 'center');
          this.queenButton.set('originY', 'center');
          this.queenButton.set('top', y);
          this.queenButton.set('left', x);
          this.queenButton.set('selectable', true);
          this.queenButton.set('lockMovementX', true);
          this.queenButton.set('lockMovementY', true);
          this.queenButton.set('lockRotation', true);
          this.queenButton.set('lockScalingX', true);
          this.queenButton.set('lockScalingY', true);
          this.queenButton.set('lockUniScaling', true);
          this.queenButton.set('hasControls', false);
          this.queenButton.set('hasBorders', false);
          this.queenButton.scaleToHeight(choiceSize);
          this.queenButton.setCoords();
          this.queenButton.on('selected', () => {
            move.promotion = { role: 'Q' };
            this.performPromotion(move);
          });
        }
      }

      this.promotionDialog = new fabric.Group(group, {
        left: 0,
        top: 0,
        width: this.size,
        height: this.size,
      });

      this.promotionDialog.set('lockMovementX', true);
      this.promotionDialog.set('lockMovementY', true);
      this.promotionDialog.set('lockRotation', true);
      this.promotionDialog.set('lockScalingX', true);
      this.promotionDialog.set('lockScalingY', true);
      this.promotionDialog.set('lockUniScaling', true);
      this.promotionDialog.set('hasControls', false);
      this.promotionDialog.set('hasBorders', false);
      this.promotionDialog.set('selectable', false);
      this.promotionDialog.scaleToHeight(this.size);
      this.promotionDialog.scaleToWidth(this.size);
      this.canvas?.add(this.promotionDialog);
      this.promotionDialog.moveTo(500);
      if (this.knightButton) {
        this.canvas?.add(this.knightButton);
        this.knightButton.moveTo(510);
      }
      if (this.bishopButton) {
        this.canvas?.add(this.bishopButton);
        this.bishopButton.moveTo(510);
      }
      if (this.rookButton) {
        this.canvas?.add(this.rookButton);
        this.rookButton.moveTo(510);
      }
      if (this.queenButton) {
        this.canvas?.add(this.queenButton);
        this.queenButton.moveTo(510);
      }
      this.canvas?.requestRenderAll();
    }
  }

  showPromotionDialog(move: ChessMove) {
    if (!this.promotionDialog) {
      const object = this.pieces[move.from].object;
      if (object) {
        object.set('lockMovementX', true);
        object.set('lockMovementY', true);
        object.set('selectable', false);
      }
      this.createPromotionDialog(move);
      this.midPromotion = true;
      return;
    }
  }

  makeMove(move: ChessMove): void {
    if (this.pieces[move.from]) {
      const piece = this.pieces[move.from];
      delete this.pieces[move.from];
      delete this.tiles[move.from].piece;
      if (piece.object) {
        const row = Math.floor(move.to / 8);
        const col = move.to % 8;
        const tileSizeFragment = this.tileSize / 100;
        const piecePadding = Math.ceil(tileSizeFragment * 3) + 1;
        let xDest = 0;
        let yDest = 0;
        if (this.settings.orientation === 'white') {
          xDest = (col * this.tileSize) + piecePadding;
          yDest = ((7 - row) * this.tileSize) + piecePadding;
        } else {
          xDest = ((7 - col) * this.tileSize) + piecePadding;
          yDest = (row * this.tileSize) + piecePadding;
        }
        this.startMoveAnimation(piece.object, xDest, yDest);
        const to = row * 8 + col;
        const capture = this.pieces[to];
        if (capture) {
          this.canvas?.remove(capture.object);
        }
        piece.tile = to;
        this.pieces[to] = piece;
        this.tiles[to].piece = { color: move.color, role: move.role };
        if(move.castle){
          const rmove = new ChessMove();
          rmove.to = move.castle.to;
          rmove.from = move.castle.from;
          rmove.color = move.color;
          this.makeMove(rmove);
        }
      }
    }
    this.canvas?.requestRenderAll();
  }
  unMakeMove(move: ChessMove) {
    if (this.pieces[move.to]) {
      const piece = this.pieces[move.to];
      delete this.pieces[move.to];
      delete this.tiles[move.to].piece;
      if (piece.object) {
        const row = Math.floor(move.from / 8);
        const col = move.from % 8;
        const tileSizeFragment = this.tileSize / 100;
        const piecePadding = Math.ceil(tileSizeFragment * 3) + 1;
        let xDest = 0;
        let yDest = 0;
        if (this.settings.orientation === 'white') {
          xDest = (col * this.tileSize) + piecePadding;
          yDest = ((7 - row) * this.tileSize) + piecePadding;
        } else {
          xDest = ((7 - col) * this.tileSize) + piecePadding;
          yDest = (row * this.tileSize) + piecePadding;
        }
        this.startMoveAnimation(piece.object, xDest, yDest);
        const from = row * 8 + col;
        const capture = move.capture;
        if (capture) {
          this.addPiece(move.to, capture.color, capture.role);
        }
        piece.tile = from;
        this.pieces[from] = piece;
        this.tiles[from].piece = { color: move.color, role: move.role };
        piece.object.moveTo(10);
        piece.object.setCoords();
        this.promotionDialog?.moveTo(500);
        if(move.castle){
          const rmove = new ChessMove();
          rmove.to = move.castle.to;
          rmove.from = move.castle.from;
          rmove.color = move.color;
          this.unMakeMove(rmove);
        }
      }
    }
    this.canvas?.requestRenderAll();
  }

  private resetMove(move: ChessMove): void {
    const piece = this.pieces[move.from].object;
    if (piece) {
      const row = Math.floor(move.from / 8);
      const col = move.from % 8;
      const tileSizeFragment = this.tileSize / 100;
      piece.scaleToHeight(Math.ceil(tileSizeFragment * 90));
      const piecePadding = Math.ceil(tileSizeFragment * 3) + 1;
      if (this.settings.orientation == 'white') {
        piece.set('left', Math.floor(col * this.tileSize) + piecePadding);
        piece.set('top', Math.floor((7 - row) * this.tileSize) + piecePadding);
      } else {
        piece.set('left', Math.floor((7 - col) * this.tileSize) + piecePadding);
        piece.set('top', Math.floor(row * this.tileSize) + piecePadding);
      }
      piece.moveTo(10);
      this.promotionDialog?.moveTo(500);
      piece.setCoords();
    }
  }

  // board API
  public addPiece(tile: number, color: string, role: string) {
    const col = tile % 8;
    const row = Math.floor(tile / 8);
    const padding = 1;
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
          const tileSizeFragment = this.tileSize / 100;
          pieceObject.scaleToHeight(Math.ceil(tileSizeFragment * 90));
          const piecePadding = Math.ceil(tileSizeFragment * 3) + 1;
          if (this.settings.orientation == 'white') {
            pieceObject.set('left', Math.floor(col * this.tileSize) + piecePadding);
            pieceObject.set('top', Math.floor((7 - row) * this.tileSize) + piecePadding);
          } else {
            pieceObject.set('left', Math.floor((7 - col) * this.tileSize) + piecePadding);
            pieceObject.set('top', Math.floor(row * this.tileSize) + piecePadding);
          }
          pieceObject.setCoords();
          this.pieces[tile] = { tile: tile, object: pieceObject };
          // @ts-ignore
          this.tiles[tile]['piece'] = { role, color } as Piece;
          if (this.canvas) {
            this.canvas?.add(pieceObject);
            pieceObject.moveTo(10);
          }
        });
      }
    }
  }

  public removePiece(tile: number) {
    const object = this.pieces[tile].object;
    delete this.pieces[tile];
    this.canvas?.remove(object);
    delete this.tiles[tile].piece;
  }


  public isValidDrop(from: number, to: number): boolean {
    if (this.olga.validGame()) {
      const position = this.olga.getGame()?.getPosition();
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
      if (this.settings.orientation == 'white') {
        row = Math.ceil((this.size - y) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - x) / this.tileSize) - 1;
      }
      const tile = row * 8 + col;
      const move = new ChessMove();
      move.from = this.selectedPiece.tile;
      move.to = tile;
      const piece = this.tiles[move.from].piece;
      if (piece) {
        move.color = piece.color;
        move.role = piece.role;
      }
      if (x < 0 || x > this.size || y > this.size || y < 0) {
        this.resetMove(move);
      } else {
        if (
          this.isValidDrop(this.selectedPiece.tile, tile) &&
          this.olga.validGame() && this.olga.getGame()?.makeMove(move)
        ) {
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
      if (this.settings.orientation == 'white') {
        row = Math.ceil((this.size - point.clientY) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - point.clientX) / this.tileSize) - 1;
      }
      const tileIndex = row * 8 + col;
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
    if (this.settings.orientation == 'white') {
      row = Math.ceil((this.size - y) / this.tileSize) - 1;
    } else {
      col = Math.ceil((this.size - x) / this.tileSize) - 1;
    }
    const tileIndex = row * 8 + col;
    if (tileIndex >= 0 && tileIndex < 64) {
      this.selectedPiece = this.pieces[tileIndex];
      //this.highlightTile(tileIndex);
    } else {
      this.canvas?.discardActiveObject();
      this.selectedPiece = null;
    }
  }

  private clearBoard(): void {
    this.clearMaterial();
    this.clearLabels();
    this.tiles.forEach((tileData) => {
      this.canvas?.remove(tileData.tile);
    });
    this.tiles = [];
    if(this.background) {
      this.canvas?.remove(this.background);
    }
    if(this.tileGroup){
      this.canvas?.remove(this.tileGroup);
    }
  }

  public clearMaterial(): void {
    this.pieces.forEach((piece) => {
      this.canvas?.remove(piece.object);
    });
    this.pieces = [];
  }

  public clearLabels(): void{
    this.labels.forEach((value) =>{
      if(this.tileGroup){
        this.tileGroup.remove(value);
      }
      });
    this.labels = [];
  }

  private connectMouseInput(): void {
    if (this.canvas) {
      this.canvas.on('object:moved', this.checkValidDrop.bind(this));
      this.canvas.on('mouse:down', this.selectPiece.bind(this));
    }
  }
  private createBoardObject(type: ObjectType, x: number, y: number, selectable = false, labelText = '', isDark?: boolean): fabric.Rect | fabric.Text | null {
    let object: fabric.Object | null = null;
    switch(type) {
      case ObjectType.Label:{
        object = new fabric.Text(labelText, {
          fontSize: this.theme.labelFontSize, left: x, top: y, fontFamily: this.theme.labelFontFamily,
          fontWeight: this.theme.labelFontWeight
        }) as fabric.Object;
        
        if(isDark !== undefined && isDark !== null) {
          object.setColor(isDark ? this.themes.boardLabelDark.value : this.themes.boardLabelLight.value);
        }
        break;
      }
      case ObjectType.Tile:{
        object = new fabric.Rect({
          width: this.tileSize,
          height: this.tileSize,
        });
        if(isDark !== undefined && isDark !== null) {
          object.setColor(isDark ? this.themes.boardBGDark.value : this.themes.boardBGLight.value);
        }
        break;
      }
    }
    if(object) {
      object.set('left', x);
      object.set('top', y);
      object.set('lockRotation', true);
      object.set('lockScalingX', true);
      object.set('lockScalingY', true);
      object.set('lockUniScaling', true);
      object.set('hasControls', false);
      object.set('hasBorders', false);
      object.set('selectable', false);
      object.set('lockMovementX', !selectable);
      object.set('lockMovementY', !selectable);
      object.set('selectable', selectable);
      object.setCoords(); 
    }
    return object;
  }

  private generateBoardObjects(): void {
    if (this.canvas) {
      const tiles = [];
      const labels = [];
      const padding = 2;
      let dark = false;
      const size = this.tileSize * 8;
      const background = new fabric.Rect({
        // position from group center
        left: 0,
        top: 0,
        width: size,
        height: size,

        stroke: 'black',
        strokeWidth: 3,
        fill: undefined
      })
      background.set('lockMovementX', true);
      background.set('lockMovementY', true);
      background.set('lockRotation', true);
      background.set('lockScalingX', true);
      background.set('lockScalingY', true);
      background.set('lockUniScaling', true);
      background.set('hasControls', false);
      background.set('hasBorders', false);
      background.set('selectable', false);
      background.setCoords();
      this.background = background;
      for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
          if (row % 2 === 0) {
            // even row 0, 2, 4, 6
            if (col % 2 === 0) {
              dark = false;
            } else {
              dark = true;
            }
          } else {
            // odd row 1, 3, 5, 7
            if (col % 2 === 0) {
              dark = true;
            } else {
              dark = false;
            }
          }
          const tile = this.createBoardObject(ObjectType.Tile, col * this.tileSize + padding , row * this.tileSize + padding, true,'', dark);
          if(tile){
            this.tiles.push({ tile });
            tiles.push(tile);
          }
          if(this.showLabels) {          
            let labelText = '';
            let rowText = '';
            if (this.settings.orientation == 'white') {
              labelText = SquareNames[((7 - row) * 8) + col][0];
              rowText = (8-row).toString();
            } else {
              labelText = SquareNames[(row * 8) + (7-col)][0];
              rowText = (row + 1).toString();
            }
            let x = 4 + padding;
            let y = (row * this.tileSize) + 4;
            if (col == 0) {
              const file = this.createBoardObject(ObjectType.Label, x, y, false, rowText, !dark);
              if(file){
                labels.push(file);
                this.labels.push(file);
              }
            }
            if (row == 7) {
              const rank = this.createBoardObject(ObjectType.Label, ((this.tileSize * (col + 1)) - this.theme.labelFontSize/2) - padding, size - this.theme.labelFontSize, false, labelText, !dark);
              if(rank){
                labels.push(rank);
                this.labels.push(rank);
              }
            }
          }
        }
      }
      let objects: (fabric.Rect | fabric.Text)[] = [];
      objects = objects.concat(tiles, labels);
      const tileGroup = new fabric.Group(objects, {
        left: 0,
        top: 0,
      });
      tileGroup.set('left', 0);
      tileGroup.set('top', 0);
      tileGroup.set('lockMovementX', true);
      tileGroup.set('lockMovementY', true);
      tileGroup.set('lockRotation', true);
      tileGroup.set('lockScalingX', true);
      tileGroup.set('lockScalingY', true);
      tileGroup.set('hasControls', false);
      tileGroup.set('hasBorders', false);
      tileGroup.set('lock');
      tileGroup.set('selectable', false);
      tileGroup.set('originX', 'left');
      tileGroup.set('originY', 'top');
      this.canvas.add(background);
      this.canvas.add(tileGroup);
      this.tileGroup = tileGroup;
      background.moveTo(-40);
      tileGroup.moveTo(-30);
      this.canvas.requestRenderAll();
    }
  }

  
  private resizeBoardObjects(size: number): void {
    if(!this.background) {
      return;
    }
    this.tileSize = Math.floor(this.size / 8);
    this.background.scaleToHeight((this.tileSize * 8) - 1); 
    this.background.scaleToWidth((this.tileSize * 8) - 1);
    if (this.tileGroup) {
      this.tileGroup.set('top', 0);
      this.tileGroup.set('left', 0);
      this.tileGroup.scaleToHeight(this.tileSize * 8);
      this.tileGroup.scaleToWidth(this.tileSize * 8);
      this.tileGroup.moveTo(-300);
      this.tileGroup.setCoords();
    }
    this.pieces.forEach((pieceData) => {
      const piece = pieceData.object;
      if (piece.left !== undefined && piece.top !== undefined && this.canvas) {
        const row = Math.floor(pieceData.tile / 8);
        const col = pieceData.tile % 8;
        const tileSizeFragment = this.tileSize / 100;
        piece.scaleToHeight(Math.ceil(tileSizeFragment * 90));
        const piecePadding = Math.ceil(tileSizeFragment * 3) + 1;
        if (this.settings.orientation == 'white') {
          piece.set('left', Math.floor(col * this.tileSize) + piecePadding);
          piece.set('top', Math.floor((7 - row) * this.tileSize) + piecePadding);
        } else {
          piece.set('left', Math.floor((7 - col) * this.tileSize) + piecePadding);
          piece.set('top', Math.floor(row * this.tileSize) + piecePadding);
        }
        piece.moveTo(10);
        piece.setCoords();
      }
    });
    if (this.promotionDialog) {
      this.promotionDialog.scaleToHeight(this.size);
      this.promotionDialog.scaleToWidth(this.size);
      this.promotionDialog?.moveTo(500);

      // knight
      let y = this.size * 0.67 + 4;
      let x = this.size * 0.205;
      this.knightButton?.scaleToHeight(this.size * 0.15);
      this.knightButton?.scaleToWidth(this.size * 0.15);
      this.knightButton?.set('left', x);
      this.knightButton?.set('top', y);
      this.knightButton?.moveTo(510);
      this.knightButton?.setCoords();
      // bishop

      x = this.size * 0.4;
      this.bishopButton?.scaleToHeight(this.size * 0.15);
      this.bishopButton?.scaleToWidth(this.size * 0.15);
      this.bishopButton?.set('left', x);
      this.bishopButton?.set('top', y);
      this.bishopButton?.moveTo(510);
      this.bishopButton?.setCoords();
      // rook

      x = this.size * 0.595;
      this.rookButton?.scaleToHeight(this.size * 0.15);
      this.rookButton?.scaleToWidth(this.size * 0.15);
      this.rookButton?.set('left', x);
      this.rookButton?.set('top', y);
      this.rookButton?.moveTo(510);
      this.rookButton?.setCoords();
      // queen

      x = this.size * 0.79;
      this.queenButton?.scaleToHeight(this.size * 0.15);
      this.queenButton?.scaleToWidth(this.size * 0.15);
      this.queenButton?.set('left', x);
      this.queenButton?.set('top', y);
      this.queenButton?.moveTo(510);
      this.queenButton?.setCoords();
    }
  }
  
  public getPieceAnimation(): Coordinate {
    let x = 0;
    let y = 0;

    return {x, y} as Coordinate;
  }

  public updatePieceAnimation(x: number, y: number):void {

  }

  setDarkTile(color: string): void {
    if (this.tiles.length != 0 && this.theme) {
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
      if(this.labels.length) {
        this.labels.forEach((label: fabric.Object)=>{
          // @ts-ignore
          if(label &&  label.get('fill') === this.theme.tileDark) {
            label.setColor(color);
          }
        });
      }
      this.theme.tileDark = color;      
      this.canvas?.requestRenderAll();
    }
  }

  public setLightTile(color: string): void {
    if (this.tiles.length != 0 && this.theme) {
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
      if(this.labels.length) {
        this.labels.forEach((label: fabric.Object)=>{
          // @ts-ignore
          if(label && label.get('fill') === this.theme.tileLight) {
            label.setColor(color);
          }
        });
      }
      this.theme.tileLight = color;      
      this.canvas?.requestRenderAll();
    }

  }

  public setSize(size: number): void {
    if (this.canvas) {
      this.size = size;
      this.tileSize = Math.floor(size / 8);
      this.canvas.width = size;
      this.canvas.height = size;
      this.canvas.setDimensions({
        width: size + 4,
        height: size + 4,
      });
      this.resizeBoardObjects(size);
      this.canvas.requestRenderAll();
    }
  }

  public setInteractive(interactive: boolean): void {
    if (interactive) {
      if (this.canvas) {
      }
    } else {
      if (this.canvas) {
      }
    }
  }

  public setBoardToPosition(position: any): void {
    this.clearMaterial();
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

  public requestRedraw(): void {
    this.clearBoard();
    this.generateBoard();
  }
  
  public show(): void {
    if(this.boardCanvas) {
      this.boardCanvas.nativeElement.style.visibility = 'visible';
    }
  }
  public hide(): void {
    if(this.boardCanvas) {
      this.boardCanvas.nativeElement.style.visibility = 'hidden';
    }
  }
}
