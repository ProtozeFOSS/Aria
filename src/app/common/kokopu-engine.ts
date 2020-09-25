
//@ts-ignore
import { Game as KGame, Variation as KVariation, MoveDescriptor, Node as KNode, Position as KPosition, pgnRead, Database as KDatabase } from 'kokopu';
import { SquareNames } from '../canvas-chessboard/types';

export class GameScoreItem {
    type = 0;
    move: KNode | null = null;
    constructor(
        protected game: ChessGame | null = null,
        move?: KNode
    ) {
        this.move = move;
    }
    addType(type: GameScoreType): void {
        this.type |= type;
    }
    removeType(type: GameScoreType): void {
        this.type ^= type;
    } 
    getType(previous: GameScoreItem | null = null): number {
        if (this.move) {
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
    setSelected(select = true): void {
        if (select) {
            this.type = this.type | GameScoreType.Selected;
        } else {
            this.type = this.type ^ GameScoreType.Selected;
        }
    }
    isBranched(): boolean {
        return ((this.type & GameScoreType.Branched) == GameScoreType.Branched);
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
        if(!node || !node._info) {
            return null;
        }
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
    compareMoveToNode(node: KNode): boolean {
        const mDescriptor = node._info.moveDescriptor;
        if(mDescriptor) {
            return (this.to === SquareNames.indexOf(mDescriptor.to()) && this.from === SquareNames.indexOf(mDescriptor.from()));
        }
        return false;
    }
}
export type GameScorePath = {active: number, paths:GameScoreItem[]};
export type Traversal = {right: number, down: number};
export class ChessGame {
    protected position: KPosition | null = null;
    protected scorePath: Array<Traversal> = [];
    protected startNode: KNode | null = null;
    protected currentNode: KNode | null = null;
    protected lastNode: KNode | null = null;
    protected currentIndex = 0;

    protected static compareKNode(left: KNode, right: KNode): boolean {
        if (left !== null &&
            right !== null &&
            left !== undefined &&
            right !== undefined) {
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
        if (left !== null &&
            right !== null &&
            left !== undefined &&
            right !== undefined) {
            if (ChessGame.compareKNode(left.first(), right.first())) {
                return (
                    left.comment() === right.comment() &&
                    left.initialFullMoveNumber() === right.initialFullMoveNumber()
                );
            }
        }
        return false;
    }
    static parsePGN(olga: any, pgn: string): ChessGame[] {
        const games = [];
        const state = pgnRead(pgn) as KDatabase;
        if(state) {
            const gameCount = state.gameCount();
            for(let index = 0; index < gameCount; ++index) {
                games.push(new ChessGame(olga, state.game(index)));
            }            
        }
        return games;
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
        this.olga.redrawBoard();
        this.olga.updateStatus(this.position.turn(), node);
    }

    protected addNextMove(notation: string): void {
        this.currentNode = this.currentNode.play(notation);
        this.olga.gameScoreItemsChanged(this.generateGameScore());
    }

    public onVariant(): boolean {
        this.scorePath.forEach((traversal:Traversal)=>{
            if(traversal.down > 0) {
                return true;
            }
            return false;
        });
        return false;
    }

    public performPromotion(move: ChessMove) {
        if (move.promotion && move.promoteFunction) {
            const moveDesc = move.promoteFunction(move.promotion.role.toLowerCase());
            if (this.position.play(moveDesc)) {
                const node = this.currentNode.play(moveDesc);
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

    constructor(protected olga: any, public game?: KGame) {
        if (game) {
            this.setGame(this.game);
        }
    }

    public getPosition(): KPosition | null {
        return this.position;
    }

    protected generateRootScore(): GameScoreItem[] {
        const items = Array<GameScoreItem>();
        const variation = this.game.mainVariation();
        let node = variation.first();
        let previous = null;
        let gItem = null;
        while(node) {
            gItem = new GameScoreItem(this, node);
            gItem.getType(previous);
            items.push(gItem);
            previous = gItem;
            node = node.next();
        }
        return items;
    }

    public generateGameScore(): GameScoreItem[] {
        let items = Array<GameScoreItem>();
        let gItem = null;
        let previous = null;
        const traversals = this.scorePath.length;
        let current = this.startNode;
        if(traversals == 0) {
            items = this.generateRootScore();
        }
        for(let index = 0; index < traversals; ++index) {
            const traversal = this.scorePath[index] as Traversal;
            for(let j = 0; j < traversal.right; ++j){
                gItem = new GameScoreItem(this, current);
                gItem.getType(previous);
                items.push(gItem);
                previous = gItem;
                current = current.next();
                // go down
            }
            if(traversal.down > 0) {
                const variations = current.variations() as KVariation[];
                if(variations.length > (traversal.down-1)) {
                    const variation = variations[traversal.down-1];
                    current = variation.first();
                    console.log('Branching at ' + current.notation());
                    gItem = new GameScoreItem(this, current);
                    gItem.getType(previous);
                    items.push(gItem);
                    previous = gItem;
                    current = current.next();
                }
            }
        }
        while(current) {
            gItem = new GameScoreItem(this, current);
            gItem.getType(previous);
            items.push(gItem);
            previous = gItem;
            current = current.next();
        }
        if(items.length > 0) {
            this.lastNode = items[items.length - 1].move;
        }
        return items;
    }

    setGame(game: KGame): void {
        this.game = game;
        let variation = this.game.mainVariation() as KVariation;
        this.startNode = variation.first();
        this.position = variation.initialPosition() as KPosition;
        this.currentNode = null;
        this.olga.redrawBoard();
    }


    public moveToPrevious(previousNode: KNode, current: KNode): ChessMove | null {
        if(this.currentNode) {
            const previousPosition = this.currentNode.positionBefore();
            if(previousPosition && this.currentNode) {
                const moveToBeUndone = ChessMove.fromNode(this.currentNode) as ChessMove;
                this.olga.updateStatus(this.position.turn(), previousNode);
                return moveToBeUndone;
            }
            this.position = previousPosition;
            this.currentNode = previousNode;
            --this.currentIndex;
        }
        return null;
    }
    
    public isGameOver(): boolean {
        return (this.position.isLegal() && this.position.moves().length == 0);
    }

    public play(next: KNode): boolean {
        if (this.position.play(next._info.moveDescriptor)) {
            this.currentNode = next;
            this.olga.updateStatus(this.position.turn(), next);
            ++this.currentIndex;
            return true;
        }
        return false;
    }
    public unPlay(previous: KNode): boolean {
        if(previous) {
            this.position = previous.position();
            this.currentNode = previous;
            --this.currentIndex;
            this.olga.updateStatus(this.position.turn(), previous);
            return true;
        }
        return false;
    }

    public createVariation(move: MoveDescriptor | string): boolean {
        if(this.currentNode){
            const variationsBefore = this.currentNode.variations();
            this.currentNode = this.currentNode.play(move);
            this.position = this.currentNode.position();
            this.olga.updateStatus(this.position.turn(), this.currentNode);
            this.scorePath.push({right:this.currentIndex, down: variationsBefore.length + 1});
            this.currentIndex = 0;
            this.olga.updateStatus(this.position.turn(), this.currentNode);
            // tell it to restore gamescore
            this.olga.gameScoreItemsChanged(this.generateGameScore());
            this.olga.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public addMoveToEnd(move: MoveDescriptor): boolean {
        if(this.currentNode && this.position.play(move)) {
            const next = this.currentNode.play(move);
            this.currentNode = next;
            this.position = this.currentNode.position();
            this.olga.updateStatus(this.position.turn(), this.currentNode);
            // tell it to restore gamescore
            this.olga.gameScoreItemsChanged([]);
            this.olga.gameScoreItemsChanged(this.generateGameScore());
            this.olga.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public makeVariantMove(index: number, node: KNode, updateBoard = false) : boolean {
        const variations= node.variations();
        if(index >= 0 && index < variations.length) {
            const variation = variations[index];
            this.currentNode = variation.first();
            this.position = this.currentNode.position();
            this.olga.updateStatus(this.position.turn(), this.currentNode);
            this.scorePath.push({right:this.currentIndex, down: index + 1});
            this.currentIndex = 0;
            if(updateBoard) {
                this.olga.makeBoardMove(ChessMove.fromNode(this.currentNode));
            }
            this.olga.updateStatus(this.position.turn(), this.currentNode);
            // tell it to restore gamescore
            this.olga.gameScoreItemsChanged(this.generateGameScore());
            this.olga.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public makeMoveOrVariation(nextMove: KNode, moveToBeMade: ChessMove, legalMove: MoveDescriptor | string): boolean {
        let valid = false;
        if(nextMove && moveToBeMade.compareMoveToNode(nextMove)) {
            valid = this.position.play(legalMove);
            this.olga.incrementGameScoreSelection();
            this.currentNode = nextMove;
            ++this.currentIndex;
        }else {
            // search through all the variant moves, if
            if(nextMove) {
                const variations = nextMove.variations();
                for(let index = 1; index <= variations.length; ++index){
                    const variation = variations[index-1];
                    const variantMove = variation.first();
                    if(moveToBeMade.compareMoveToNode(variantMove)){
                        return this.makeVariantMove(index-1, nextMove);
                    }
                }
            }
            // move is new, createVariant
            return this.createVariation(legalMove);

        }
        return valid;
    }

    public makeMove(move: ChessMove): boolean {
        // Valid move of current variation (continue main variation)
        // Move of a separate Variation that exists (move to that variation)
        // at the end of variation but game isnt over ( Create New Move)
        // move of separate variation that does not exist ( Create Move/Variation)  

       
        const legal = this.position.isMoveLegal(SquareNames[move.from], SquareNames[move.to]);
        let lastNode = null;
        if(legal) {  
            if (legal.status == 'promotion') {
                move.promoteFunction = legal;
                this.olga.showPromotionDialog(move);
                return true;
            }
            const legalMove = legal();
            if(this.currentNode == null) {
                this.currentNode = this.startNode;
                return this.makeMoveOrVariation(this.currentNode, move, legalMove);
            }
            const nextMove = this.currentNode.next();
            if(!nextMove) {
                return this.addMoveToEnd(legalMove);
            }
            console.log("Next Move ->" + nextMove.notation());
            lastNode = this.currentNode;
            return this.makeMoveOrVariation(nextMove, move, legalMove);  

        } 
        return false;
    }
    

    public resetEngine(): void {
        this.position.reset();
        this.currentNode = null;
        this.olga.updateStatus(this.position.turn());
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

