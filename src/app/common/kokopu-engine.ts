
//@ts-ignore
import { Game as KGame, Variation as KVariation, Node as KNode, Position as KPosition } from 'kokopu';
import { BehaviorSubject } from 'rxjs';
import { SquareNames } from '../canvas-chessboard/types';
// Game Score

export class GameScoreVariation {
    variationData: GameScoreItem[];
    constructor(variationData: GameScoreItem[] = []) {
        this.variationData = variationData;
    }
}

export class GameScoreAnnotation {
    annotation = '';
    constructor(annotation: string = '') {
        this.annotation = annotation;
    }
}

export class GameScoreItem {
    type = 0;
    move: KNode | null = null;
    selection = 0;
    current = false;

    // flatten the variables

    constructor(
        protected game: ChessGame | null = null,
        protected index: number,
        move?: KNode
    ) {
        this.move = move;
        this.getType();
    }
    getIndex(): number {
        return this.index;
    }
    addType(type: GameScoreType): void {
        this.type |= type;
    }
    removeType(type: GameScoreType): void {
        this.type ^= type;
    } 
    getType(): number {
        if (this.move) {
            const previous = this.previous();
            let variations = this.move.variations();
            if (previous) {
                if (previous.move.moveColor() == 'w') {
                    this.type |= GameScoreType.HalfPly;
                    if (!previous.move.comment()) {
                        this.type |= GameScoreType.Group;
                    }
                }
            }
            if (variations && variations.length > 0) {
                this.type |= GameScoreType.Variation;
            } else if (this.move.comment()) {
                this.type |= GameScoreType.Annotation;
            } else {
                let comment = null;
                if (previous && previous.move) {
                    comment = previous.move.comment();
                }
                if ((!previous && this.move.moveColor() == 'w') || !comment) {
                    this.type |= GameScoreType.Group;
                }
            }
        }
        return this.type;
    }

    next(): GameScoreItem | null {
        if (this.game) {
            return this.game.getNext(this.index);
        }
        return null;
    }
    previous(): GameScoreItem | null {
        if (this.game) {
            return this.game.getPrevious(this.index);
        }
        return null;
    }
    setSelected(select = true): void {
        if (select) {
            this.type = this.type | GameScoreType.Selected;
        } else {
            this.type = this.type ^ GameScoreType.Selected;
        }
    }
}

export class ChessMove {
    to: number = 0;
    from: number = 0;
    role: string = '';
    color: string = '';
    capture?: { role: string; color: string };
    promotion?: { role: string };
    castle?: {type:string, to:number, from: number};
    promoteFunction?: any;
    static fromNode(node: KNode): ChessMove | null {
        const move = new ChessMove();
        const mDescriptor = node._info.moveDescriptor;
        if (mDescriptor) {
            move.from = SquareNames.indexOf(mDescriptor.from());
            move.to = SquareNames.indexOf(mDescriptor.to());
            if (mDescriptor.isCapture()) {
                move.capture = { role: mDescriptor.capturedPiece().toUpperCase(), color: mDescriptor.capturedColoredPiece()[0] };
            }
            if (mDescriptor.isCastling()) {
                move.castle = {type: node.notation(), to: SquareNames.indexOf(mDescriptor.rookTo()), from: SquareNames.indexOf(mDescriptor.rookFrom())};
            }
            if (mDescriptor.isPromotion()) {
                move.promotion = { role: mDescriptor.promotion() };
            }
            return move;
        }
        return null;
    }
}

export class ChessGame {
    protected position: KPosition | null = null;
    protected currentNode: KNode | null = null;
    protected currentVariation: KVariation | null = null;
    protected currentIndex = -1;
    protected nodeMap: Array<GameScoreItem> = [];
    protected moveMap: KNode | KVariation[] = [];
    protected gameVariations: KVariation[] = [];
    protected variation: KVariation | null = null;
    protected startNode: KNode | null = null;
    protected lastNode: KNode | null = null;
    protected isVariation = false;
    public fen = '';
    public getNodeIndex(): number {
        return this.currentIndex;
    }
    protected static compareKNode(left: KNode, right: KNode): boolean {
        if (
            left !== null &&
            right !== null &&
            left !== undefined &&
            right !== undefined
        ) {
            const leftMove = left._info.moveDescriptor;
            const rightMove = right._info.moveDescriptor;
            return (
                leftMove.from() === rightMove.from() && leftMove.to() === rightMove.to()
            );
        }
        return false;
    }

    protected static compareVariation(
        left: KVariation,
        right: KVariation
    ): boolean {
        if (
            left !== null &&
            right !== null &&
            left !== undefined &&
            right !== undefined
        ) {
            if (ChessGame.compareKNode(left.first(), right.first())) {
                return (
                    left.comment() === right.comment() &&
                    left.initialFullMoveNumber() === right.initialFullMoveNumber()
                );
            }
        }
        return false;
    }

    protected getLastNode(): KNode {
        let node = this.currentNode;
        while (node && node.next()) {
            node = node.next();
        }
        return node;
    }

    protected setNode(node: KNode) {
        this.position = node.position();
        this.currentNode = node.next();
        this.lastNode = this.getLastNode();
        if (!this.currentNode) {
            this.currentNode = this.lastNode;
        }
        this.fen = this.position.fen();
        this.olga.redrawBoard();
        this.olga.updateStatus(this.position.turn(), node);
    }

    public onVariant(): boolean {
        return this.isVariation;
    }

    public getNext(index: number): GameScoreItem | null {
        const next = index + 1;
        if (next >= 0 && next < this.nodeMap.length) {
            return this.nodeMap[next];
        }
        return null;
    }

    public getPrevious(index: number): GameScoreItem | null {
        const prev = index - 1;
        if (prev >= 0 && prev < this.nodeMap.length) {
            return this.nodeMap[prev];
        }
        return null;
    }

    public performPromotion(move: ChessMove) {
        if (move.promotion && move.promoteFunction) {
            //const moveDesc = 1
            const moveDesc = move.promoteFunction(move.promotion.role.toLowerCase());
            if (this.position.play(moveDesc)) {
                const node = this.variation.play(moveDesc);
                if (!this.lastNode || this.lastNode == this.currentNode) {
                    this.lastNode = node;
                }
                if (!this.startNode) {
                    this.startNode = node;
                }
                this.currentNode = node;
                this.currentNode._info.moveDescriptor = moveDesc;
            }
        }
    }
    public makeMove(move: ChessMove, fromPGN = false): void {
        let lastNode = this.currentNode;
        if (this.currentNode) {
            let pgnMove = null;
            if(this.currentNode.move) {
                move = this.currentNode.move._info.moveDescriptor
            } else {
                pgnMove = this.currentNode._info.moveDescriptor;
            }
            const toSquare = SquareNames[move.to];
            const fromSquare = SquareNames[move.from];
            const next = this.currentNode.next();
            const legal = this.position.isMoveLegal(fromSquare, toSquare);
            if (pgnMove && pgnMove.from() == fromSquare && pgnMove.to() == toSquare) {
                // not a variant
                this.position.play(pgnMove);
                if (fromPGN) {
                    if (pgnMove.isPromotion()) {
                        move.promoteFunction = legal;
                        this.olga.showPromotionDialog(move);
                    }
                    if (pgnMove.isCastling()) {
                        this.olga.redrawBoard();
                    }
                    this.olga.makeBoardMove(move);
                }
                this.currentNode = next;
            } else {
                // look for an existing variant
                console.log(
                    'Check Variants= ' + pgnMove.from() + ' -> ' + pgnMove.to()
                );
                lastNode = this.currentNode.next();
                const variations = lastNode.variations();
                this.isVariation = true;
                // Generate methods of communicating branched variations to iteration pattern
                // Adjust algorithms to account for a branched has the ability to un-branch or
                // even become another "peer" branch all togeth0er
                variations.forEach((variation: KVariation) => {
                    const firstMove = variation.first();
                    if (firstMove && firstMove._info.moveDescriptor) {
                        const test = firstMove._info.moveDescriptor;
                        if (test.to() == toSquare && test.from() == fromSquare) {
                            this.variation = variation;
                            this.gameVariations.push(variation);
                            this.position.play(test);
                            this.olga.isVariantChanged(this.isVariation);                            
                            console.log('Found Existing Variation');
                            console.log(variation);
                            ++this.currentIndex;
                            this.olga.gameScoreItemsChanged(this.generateGameScore());
                        } else {
                            console.log(
                                'Variation checked: ' + test.from() + ' -> ' + test.to()
                            );
                        }
                    }
                });
            }
        }
        if (!ChessGame.compareKNode(lastNode, this.currentNode)) {
            this.olga.updateStatus(
                this.position.turn(),
                lastNode
            );
        }
    }

    constructor(protected olga: any, public game?: KGame) {
        if (game) {
            this.setGame(this.game);
        }
    }

    public getPosition(): KPosition | null {
        return this.position;
    }

    public generateGameScore(): GameScoreItem[] {
        const items = [];
        this.nodeMap = [];
        let index = 0;
        let currentNode = this.currentNode;
        for(let i = 0; i < this.gameVariations.length; ++i) {
            const variation = this.gameVariations[i];
            let targetVariation: KVariation | null = null;
            let targetNotation = '';
            if(currentNode)
            targetNotation = currentNode.notation();
            if(i < this.gameVariations.length-1) {
                targetVariation = this.gameVariations[i+1];
            }
            let nextScore = variation.first() as KNode;
            let previous: GameScoreItem | null = null;
            let branched = (i > 0);
            while (nextScore) {
                if (nextScore) {
                    const gItem = new GameScoreItem(this, index, nextScore);
                    const notation = nextScore.notation();
                    if(targetVariation && notation == targetNotation) {
                            nextScore = null;
                            this.nodeMap[index] = gItem;
                            previous = gItem;
                            items.push(gItem);
                            ++index;
                            continue;
                    }
                    if(branched) {
                        gItem.addType(GameScoreType.Branched);
                        branched = false;
                    }
                    this.nodeMap[index] = gItem;
                    previous = gItem;
                    items.push(gItem);
                    ++index;
                    nextScore = nextScore.next();
                }
            }
        }
        this.lastNode = this.nodeMap[this.nodeMap.length - 1];
        return items;
    }

    setGame(game: KGame): void {
        this.game = game;
        this.variation = this.game.mainVariation() as KVariation;
        this.gameVariations.push(this.variation);
        this.startNode = this.variation.first();
        this.position = this.variation.initialPosition() as KPosition;
        this.currentIndex = -1;
        this.fen = this.position.fen();
        this.currentNode = null;
        this.olga.redrawBoard();
        window.setTimeout(this.generateGameScore.bind(this), 10);
    }



    public navigateToNode(index: number) {
        if (this.currentIndex < index) {
            while (this.currentIndex < index) {
                const next = this.nodeMap[++this.currentIndex] as GameScoreItem;
                if (next) {
                    const cmove = ChessMove.fromNode(next.move);
                    if (cmove) {
                        if (this.position.play(next.move._info.moveDescriptor)) {
                            this.olga.makeBoardMove(cmove);
                            this.currentNode = next.move;
                            this.olga.selectScoreItem(this.currentIndex);
                            this.nodeMap[this.currentIndex] = next;
                            this.olga.updateStatus(this.position.turn(), next.move);
                        }
                    }
                }
            }
            return;
        }
        if (this.currentIndex > index) {
            while (this.currentIndex > index && --this.currentIndex >= -1) {
                const node = this.nodeMap[this.currentIndex + 1];
                const previous = this.nodeMap[this.currentIndex];
                if (previous) {
                    const cmove = ChessMove.fromNode(node.move);
                    if (cmove) {
                        this.position = previous.move.position();
                        this.olga.unmakeBoardMove(cmove);
                        this.currentNode = previous;
                        this.olga.selectScoreItem(this.currentIndex);
                        this.olga.updateStatus(this.position.turn(), previous.move);
                    }
                } else {
                    this.position.reset();
                    this.currentIndex = -1;
                    this.currentNode = null;
                    if (!this.currentNode) {
                        this.currentNode = this.lastNode;
                    }
                    this.fen = this.position.fen();
                    this.olga.redrawBoard();
                    this.olga.updateStatus(this.position.turn());
                    this.olga.selectScoreItem(-1);
                }
            }
            return;
        }
    }

    // navigation
    public advance(updateBoard = true): boolean {
        if (!this.isFinalPosition()) {
            const next = this.currentIndex + 1;
            if (next < this.nodeMap.length && next >= 0) {
                this.navigateToNode(next);
                return true;
            }
        }
        return false;
    }

    public moveToStart(): void {
        while (this.previous()) {

        }
    }
    public moveToEnd(): void {
        this.navigateToNode(this.nodeMap.length - 1);
    }

    public previous(): boolean {
        if (!this.isStartingPosition()) {
            const prev = this.currentIndex - 1;
            if (prev < this.nodeMap.length && prev >= -1) {
                this.navigateToNode(prev);
                return true;
            }
        }
        return false;
    }

    public isStartingPosition(): boolean {
        return this.currentIndex === -1;
    }

    public isFinalPosition(): boolean {
        return this.currentIndex === (this.nodeMap.length-1);
    }

}

export enum GameScoreType {
    HalfPly = 1,
    Group = 2,
    Variation = 4,
    Annotation = 8,
    Selected = 16,
    Branched = 32
}
