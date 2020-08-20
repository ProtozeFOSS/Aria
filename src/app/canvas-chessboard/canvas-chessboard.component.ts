import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { ChessMove, GameService } from '../services/game.service';
import { ColorService } from '../services/colors.service';

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

export type Color = 'white' | 'black';

export class BoardSettings {
  orientation: Color = 'white';
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
  protected promotionDialog: fabric.Group | null = null;
  protected knightButton: fabric.Group | null = null;
  protected bishopButton: fabric.Group | null = null;
  protected rookButton: fabric.Group | null = null;
  protected queenButton: fabric.Group | null = null;
  @Input() @Output() theme: BoardTheme | null = new BoardTheme();
  @Input() @Output() settings: BoardSettings = new BoardSettings();
  @Output() pieceMap = new Map<string, fabric.Group>();
  @Output() pieces: { tile: number; object: fabric.Group }[] = [];
  @Output() tileGroup: fabric.Group | null = null;
  @Output() tiles: { tile: fabric.Object, piece?: Piece }[] = [];
  @Output() canvas: fabric.Canvas | null = null;
  @Input() @Output() selectedPiece: { tile: number; object: fabric.Group } | null = null;
  @Output() touching = false;
  @Output() midPromotion = false;
  constructor(public gameService: GameService, public colorService: ColorService) {
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
          if (this.settings.orientation == 'white') {
            pieceObject.set('left', Math.floor(col * this.tileSize) + padding);
            pieceObject.set('top', Math.floor((7 - row) * this.tileSize) + padding);
          } else {
            pieceObject.set('left', Math.floor((7 - col) * this.tileSize) + padding);
            pieceObject.set('top', Math.floor(row * this.tileSize) + padding);
          }
          pieceObject.scaleToHeight(this.tileSize);
          pieceObject.setCoords();
          this.pieces[tile] = { tile: tile, object: pieceObject };
          this.tiles[tile].piece = { role, color } as Piece;
          if (this.canvas) {
            this.canvas?.add(pieceObject);
            pieceObject.moveTo(10);
          }
        });
      }
    }
  }

  removePiece(tile: number) {
    const object = this.pieces[tile].object;
    delete this.pieces[tile];
    this.canvas?.remove(object);
    delete this.tiles[tile].piece;
  }

  protected performPromotion(move: ChessMove): void {
    if (move.promotion) {
      console.log('Promoting to ' + move.promotion.role);
      console.log('@ ' + SquareNames[move.to]);
      // remove old piece
      this.removePiece(move.to);
      this.addPiece(move.to, move.color, move.promotion.role);
      if (this.gameService.game.value) {
        this.gameService.game.value.performPromotion(move);
        this.closePromotionDialog();
      }
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
      const overlay = new fabric.Rect({ width: this.size, height: this.size, left: 0, top: 0 });
      overlay.set('lockMovementX', true);
      overlay.set('lockMovementY', true);
      overlay.set('lockRotation', true);
      overlay.set('lockScalingX', true);
      overlay.set('lockScalingY', true);
      overlay.set('lockUniScaling', true);
      overlay.set('hasControls', false);
      overlay.set('hasBorders', false);
      overlay.set('selectable', false);
      overlay.set('opacity', .65);
      overlay.setCoords();
      overlay.setColor('#0a0a0a');
      group.push(overlay);

      // Create the background square (rounded rectangle 80% width 64% height vertically and horizontally centered)
      const height = .60 * this.size;
      const width = .8 * this.size;

      const bg = new fabric.Rect({
        height: height, width: width, fill: this.colorService.bgMenu, left: (this.size - width) / 2, top: (this.size - height) / 2,
        rx: width * .02, ry: width * .02
      });
      bg.setColor(this.colorService.bgMenu);
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
      const title = new fabric.Text('Promotion', { fontWeight: '100', fontSize: this.size * .07, fontFamily: 'Courier New' })
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
      title.set('left', this.size * .5);
      title.set('top', this.size * .235);
      title.setCoords();
      group.push(title);
      // Clone the promoted piece and tile and display them horizontally centered below title
      let x = this.size / 2;
      let y = (this.size * .38) + 4;
      const tileSize = this.size * .2;
      // Tile Clone
      const tileToClone = this.tiles[tileIndex];
      if (tileToClone) {
        tileToClone.tile.clone(((promotionTile: fabric.Object) => {
          promotionTile.set('top', y);
          promotionTile.set('left', x);
          promotionTile.set('originX', 'center');
          promotionTile.set('originY', 'center');
          promotionTile.scaleToHeight(tileSize);
          promotionTile.setCoords();
          group.push(promotionTile);
        }));
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
      const prompt = new fabric.Text(color + ' has triggered promotion at', { fontSize: this.size * .04 })
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
      prompt.set('left', (this.size * .5) - 24);
      prompt.set('top', this.size * .53);
      prompt.setCoords();
      group.push(prompt);

      // Create text to right of triggered text with move
      const atText = new fabric.Text(SquareNames[tileIndex], { fontSize: this.size * .055 })
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

      atText.set('left', (promptLeft ? promptLeft : this.size * .2) + ((promptWidth !== undefined ? promptWidth : 20) / 2) + 18);
      atText.set('top', this.size * .53);
      atText.setCoords();
      group.push(atText);
      // Create 4 clones of tiles, 4 clones of pieces (Knight, Bishop, Rook, And King)

      // Create the four tiles
      y = (this.size * .67) + 4
      x = (this.size * .205);
      const choiceSize = tileSize * .75;
      if (tileToClone) {
        let buttonGroup: fabric.Object[] = [];
        tileToClone.tile.clone(((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.colorService.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup.push(tile);
        }));

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
        x = (this.size * .4);
        tileToClone.tile.clone(((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.colorService.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup2.push(tile);
        }));
        pieceImage = this.pieceMap.get(move.color + 'B');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup2.push(piece)
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
        x = (this.size * .595);
        let buttonGroup3: fabric.Object[] = [];
        tileToClone.tile.clone(((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.colorService.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup3.push(tile);
        }));
        pieceImage = this.pieceMap.get(move.color + 'R');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup3.push(piece)
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
        x = (this.size * .79);
        let buttonGroup4: fabric.Object[] = [];
        tileToClone.tile.clone(((tile: fabric.Object) => {
          tile.set('originX', 'left');
          tile.set('originY', 'top');
          tile.set('stroke', this.colorService.gsTextColorHG.value);
          tile.set('strokeWidth', 2);
          tile.set('top', 0);
          tile.set('left', 0);
          tile.scaleToHeight(choiceSize);
          tile.setCoords();
          buttonGroup4.push(tile);
        }));
        pieceImage = this.pieceMap.get(move.color + 'Q');
        if (pieceImage) {
          pieceImage.clone((piece: fabric.Group) => {
            piece.set('originX', 'left');
            piece.set('originY', 'top');
            piece.set('top', 0);
            piece.set('left', 0);
            piece.scaleToHeight(choiceSize);
            piece.setCoords();
            buttonGroup4.push(piece)
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

      this.promotionDialog = new fabric.Group(group, { left: 0, top: 0, width: this.size, height: this.size });

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
        if (this.settings.orientation == 'white') {
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
        this.tiles[to].piece = { color: move.color, role: move.role };
        // piece.object.moveTo(10);
        // this.promotionDialog?.moveTo(500);
        piece.object.setCoords();
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
        if (this.settings.orientation == 'white') {
          piece.object.set('left', col * this.tileSize);
          piece.object.set('top', (7 - row) * this.tileSize);
        } else {
          piece.object.set('left', (7 - col) * this.tileSize);
          piece.object.set('top', row * this.tileSize);
        }
        const from = (row * 8) + col;
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
      }
    }
    this.canvas?.requestRenderAll();
  }

  private resetMove(move: ChessMove): void {
    const piece = this.pieces[move.from].object;
    if (piece) {
      const row = Math.floor(move.from / 8);
      const col = move.from % 8;
      if (this.settings.orientation == 'white') {
        piece.set('left', col * this.tileSize);
        piece.set('top', (7 - row) * this.tileSize);
      } else {
        piece.set('left', (7 - col) * this.tileSize);
        piece.set('top', row * this.tileSize);
      }
      piece.moveTo(10);
      this.promotionDialog?.moveTo(500);
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
      if (this.settings.orientation == 'white') {
        row = Math.ceil((this.size - y) / this.tileSize) - 1;
      } else {
        col = Math.ceil((this.size - x) / this.tileSize) - 1;
      }
      const tile = ((row * 8) + col);
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
      if (this.settings.orientation == 'white') {
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
    if (this.settings.orientation == 'white') {
      row = Math.ceil((this.size - y) / this.tileSize) - 1;
    } else {
      col = Math.ceil((this.size - x) / this.tileSize) - 1;
    }
    const tileIndex = ((row * 8) + col);
    if (tileIndex >= 0 && tileIndex < 64) {
      this.selectedPiece = this.pieces[tileIndex];
      //this.highlightTile(tileIndex);
    } else {
      this.canvas?.discardActiveObject();
      this.selectedPiece = null;
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
      const tiles = [];
      const padding = Math.floor((this.size - this.tileSize * 8) / 2);
      for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
          // move this to clone feature, only create the tiles once.

          const tile = new fabric.Rect({
            width: this.tileSize,
            height: this.tileSize
          });

          // create piece
          if (this.settings.orientation == 'white') {
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
              tile.setColor(this.theme.tileLight);
            } else {
              tile.setColor(this.theme.tileDark);
            }
          } else {
            // odd row 1, 3, 5, 7
            if (col % 2 === 0) {
              tile.setColor(this.theme.tileDark);
            } else {
              tile.setColor(this.theme.tileLight);
            }
          }
          this.tiles.push({ tile: tile });
          tiles.push(tile);
        }
      }
      const tileGroup = new fabric.Group(tiles, {
        left: 0, top: 0
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
      tileGroup.set('lock')
      tileGroup.set('selectable', false);
      tileGroup.set('originX', 'left');
      tileGroup.set('originY', 'top');
      this.canvas.add(tileGroup);
      this.tileGroup = tileGroup;
      tileGroup.moveTo(-30);
      this.canvas.requestRenderAll();
    }
  }

  private addTile(tileData: { tile: fabric.Object, piece?: Piece }) {
    if (this.canvas) {
      this.canvas.add(tileData.tile);
      tileData.tile.moveTo(-100);
      tileData.tile.setCoords();
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
              obj.moveTo(10);
              this.pieceMap.set(piece, obj);
              subject.next(subject.value + 1);
            }
          );
        }
      }
    }
  }

  private resizeBoardObjects(size: number): void {
    const padding = Math.floor((this.size - (this.tileSize * 8)) / 2);
    if (this.tileGroup) {
      const border = padding / 2;
      this.tileGroup.set('top', border);
      this.tileGroup.set('left', border);
      this.tileGroup.scaleToHeight((this.tileSize * 8) + border);
      this.tileGroup.scaleToWidth((this.tileSize * 8) + border);
      this.tileGroup.moveTo(-300);
      this.tileGroup.setCoords();
    }
    // if (this.tiles.length > 0) {
    //   for (let index = 0; index < 64; index++) {
    //     const tile = this.tiles[index].tile;
    //     const row = Math.floor(index / 8);
    //     const col = index % 8;
    //     tile.set('originX', 'left');
    //     tile.set('originY', 'top');
    //     tile.set('width', this.tileSize);
    //     tile.set('height', this.tileSize);
    //     tile.set('top', row * this.tileSize);
    //     tile.set('left', col * this.tileSize);
    //     tile.setCoords();
    //   }
    // }

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
        if (this.settings.orientation == 'white') {
          piece.set('left', Math.floor(col * this.tileSize) + padding);
          piece.set('top', Math.floor((7 - row) * this.tileSize) + padding);
        } else {
          piece.set('left', Math.floor((7 - col) * this.tileSize) + padding);
          piece.set('top', Math.floor(row * this.tileSize) + padding);
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
      let y = (this.size * .67) + 4
      let x = (this.size * .205);
      this.knightButton?.scaleToHeight(this.size * .15);
      this.knightButton?.scaleToWidth(this.size * .15);
      this.knightButton?.set('left', x);
      this.knightButton?.set('top', y);
      this.knightButton?.moveTo(510);
      this.knightButton?.setCoords()
      // bishop

      x = (this.size * .4);
      this.bishopButton?.scaleToHeight(this.size * .15);
      this.bishopButton?.scaleToWidth(this.size * .15);
      this.bishopButton?.set('left', x);
      this.bishopButton?.set('top', y);
      this.bishopButton?.moveTo(510);
      this.bishopButton?.setCoords()
      // rook

      x = (this.size * .595);
      this.rookButton?.scaleToHeight(this.size * .15);
      this.rookButton?.scaleToWidth(this.size * .15);
      this.rookButton?.set('left', x);
      this.rookButton?.set('top', y);
      this.rookButton?.moveTo(510);
      this.rookButton?.setCoords()
      // queen

      x = (this.size * .79);
      this.queenButton?.scaleToHeight(this.size * .15);
      this.queenButton?.scaleToWidth(this.size * .15);
      this.queenButton?.set('left', x);
      this.queenButton?.set('top', y);
      this.queenButton?.moveTo(510);
      this.queenButton?.setCoords()
    }
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
