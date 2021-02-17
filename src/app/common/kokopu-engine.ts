
//@ts-ignore
import { isMoveDescriptor, Game as KGame, Variation as KVariation, MoveDescriptor, Node as KNode, Position as KPosition, pgnRead, Database as KDatabase, fen } from 'kokopu';
import { SquareNames } from '../canvas-chessboard/types';

export class GameScoreItem {
    type = 0;
    move: KNode | null = null;
    constructor(
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
        if (this.move && this.move.variations) {
            let variations = this.move.variations();
            if (previous) {
                if (previous.move.moveColor() == 'w') {
                    this.type |= GameScoreType.HalfPly;
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
    castle?: { type: string, to: number, from: number };
    promoteFunction?: any;
    static fromNode(node: KNode, descriptor: MoveDescriptor = null): ChessMove | null {
        if (!node || !node._info) {
            return null;
        }
        const move = new ChessMove();
        if (descriptor == null) {
            if (isMoveDescriptor(node._info.moveDescriptor)) {
                descriptor = node._info.moveDescriptor;
            } else {
                descriptor = node.positionBefore().notation(node._info.moveDescriptor);
            }
        }
        if (descriptor) {
            move.from = SquareNames.indexOf(descriptor.from());
            move.to = SquareNames.indexOf(descriptor.to());
            if (descriptor.isCapture()) {
                move.capture = { role: descriptor.capturedPiece().toUpperCase(), color: descriptor.capturedColoredPiece()[0] };
            }
            if (descriptor.isCastling()) {
                move.castle = { type: node.notation(), to: SquareNames.indexOf(descriptor.rookTo()), from: SquareNames.indexOf(descriptor.rookFrom()) };
            }
            if (descriptor.isPromotion()) {
                move.promotion = { role: descriptor.promotion() };
            }
            return move;
        }
        return null;
    }
    compareMoveToNode(node: KNode): boolean {
        const mDescriptor = node._info.moveDescriptor;
        if (mDescriptor) {
            return (this.to === SquareNames.indexOf(mDescriptor.to()) && this.from === SquareNames.indexOf(mDescriptor.from()));
        }
        return false;
    }
}
export type GameScorePath = { active: number, paths: GameScoreItem[] };
export type Traversal = { right: number, down: number };
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
    static parsePGN(aria: any, pgn: string): ChessGame[] {
        const games = [];
        const state = pgnRead(pgn) as KDatabase;
        if (state) {
            const gameCount = state.gameCount();
            for (let index = 0; index < gameCount; ++index) {
                games.push(new ChessGame(aria, state.game(index)));
            }
        }
        return games;
    }

    static getPositionFromFEN(fen: string) : any {
        const position = new KPosition();
        try{
            position.fen(fen);
            return position;
        }catch{

        }
        return null;
    }

    static isMoveDescriptor(move: any): boolean {
        return isMoveDescriptor(move);
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
        this.aria.redrawBoard();
        this.aria.updateStatus(this.position.turn(), node);
    }

    protected addNextMove(notation: string): void {
        this.currentNode = this.currentNode.play(notation);
        this.aria.gameScoreItemsChanged(this.generateGameScore());
    }

    public getMoveNotation(node: KNode): string {
        if (isMoveDescriptor(node._info.moveDescriptor)) {
            return node.notation();
        }
        const positionBefore = node.positionBefore();
        if (positionBefore) {
            return node._info.moveDescriptor
        }
        return '';
    }
    public onVariant(): boolean {
        this.scorePath.forEach((traversal: Traversal) => {
            if (traversal.down > 0) {
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

    constructor(protected aria: any, public game?: KGame) {
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
        while (node) {
            gItem = new GameScoreItem(node);
            gItem.getType(previous);
            items.push(gItem);
            previous = gItem;
            node = node.next();
        }
        return items;
    }

    public generateHeaderData(): Map<string, string> {
        let map = new Map<string, string>();
        if (this.game) {
            map.set('Event', this.game.event());
            const date = this.game.date();
            if (date) {
                let dateString = '';
                if (date.toDateString) {
                    dateString = date.toDateString();
                } else {
                    if (date.month) {
                        dateString += date.month;
                    }
                    if (date.year) {
                        if (dateString.length > 0) {
                            dateString += ' of ';
                        }
                        dateString += date.year;
                    }
                }
                if (dateString.length == 0) {
                    if (date.toString) {
                        dateString = date.toString();
                    }
                }
                map.set('Event Date', dateString);
            }
            map.set('White', this.game.playerName('w'));
            map.set('Black', this.game.playerName('b'));
            let elo = this.game.playerElo('w');
            if (elo != '?') {
                map.set('White Elo', elo);
            }
            elo = this.game.playerElo('b');
            if (elo !== '?') {
                map.set('Black Elo', elo);
            }
            map.set('Site', this.game.site());
            map.set('Round', this.game.round());
            map.set('Result', this.game.result());

            let variant = this.game.variant();
            if (variant === 'regular') {
                variant = "Chess";
            } else {
                variant = "Chess960"
            }
            map.set('Variant', variant);
        }
        return map;
    }

    public generateRecursiveVariation(vindex: number, variations: [KVariation], followsComment: boolean): string {
        let variationPGN = '';
        let variation = variations[vindex];
        if(variation) {
            let current = variation.first();
            variationPGN += ' (' + this.printPGNLine(current, true, followsComment) + ') ';
        }
        return variationPGN;
    }

    public printPGNLine(current: KNode, recursive = false, followsComment = false): string {
        let pgn = '';
        while(current){
            const currentPly = current.fullMoveNumber();
            if(current.moveColor() == 'w' ){ // white
                pgn += (` ${currentPly}.` + current.notation());
            } else {
                if(recursive || followsComment) { 
                    pgn += (` ${currentPly}...` + current.notation());
                }else {
                    pgn += ' ' + current.notation();
                }
            }
            const comment = current.comment();
            if(comment && comment.length > 0) {
                pgn += ` { ${comment} } `;
                followsComment = true;
            } else {
                followsComment = false;
            }
            const variations = current.variations();
            for( let i = 0; i < variations.length; ++i){
                pgn += this.generateRecursiveVariation(i, variations, followsComment);
            }
            current = current.next();
        }        
        return pgn;
    }

    public generatePGNHeader(): string {
        let pgn = '';
        if(this.game) {
            pgn += '[Event "' + this.game.event() + '"]\n';
            const site = this.game.site();
            if(site){
                pgn += `[Site "${site}"]\n`;
            }
            const date =this.game.date();
            if(date) {
                let dateString = '';
                if (date.toDateString) {
                    dateString = date.toDateString();
                } else {
                    if (date.month) {
                        dateString += date.month;
                    }
                    if (date.year) {
                        if (dateString.length > 0) {
                            dateString += ' of ';
                        }
                        dateString += date.year;
                    }
                }
                if (dateString.length == 0) {
                    if (date.toString) {
                        dateString = date.toString();
                    }
                }                
                pgn += `[Date "${dateString}"]\n`;
            }
            pgn += '[Round "' + this.game.round() + '"]\n';
            pgn += '[White "' + this.game.playerName('w') + '"]\n';
            pgn += '[Black "' + this.game.playerName('b') + '"]\n';
            pgn += '[Result "' + this.game.result() + '"]\n';
            const startFEN = this.game.initialPosition().fen();
            if(startFEN != 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){                
                pgn += `[FEN "${startFEN}"]\n`;
            }
            const variant = this.game.variant();
            if(variant !== 'regular') {
                pgn += `[Variant "${variant}"]\n`;
            }
            if(this.game.playerElo('w')){
                pgn += '[WhiteElo "' + this.game.playerElo('w') + '"]\n';
            }
            if(this.game.playerElo('b')){
                pgn += '[BlackElo "' + this.game.playerElo('b') + '"]\n';
            }
            if(this.game.playerTitle('w')){
                pgn += '[WhiteTitle "' + this.game.playerTitle('w') + '"]\n';
            }
            if(this.game.playerTitle('b')){
                pgn += '[BlackTitle "' + this.game.playerTitle('b') + '"]\n';
            }
            pgn += '[Annotator "' + this.game.annotator() + '"]\n';
        }
        return pgn.length ? pgn+'\n':'';
    }
    public generatePGN(): string {
        let pgn = this.generatePGNHeader();
        let last = null;
        let current = this.startNode;
        pgn += this.printPGNLine(current, last);
        pgn += ' ' + this.game?.result();
        return pgn;
    }

    public generateGameScore(): GameScoreItem[] {
        let items = Array<GameScoreItem>();
        let gItem = null;
        let previous = null;
        const traversals = this.scorePath.length;
        let current = this.startNode;
        if (traversals == 0) {
            items = this.generateRootScore();
            return items;
        }
        for (let index = 0; index < traversals; ++index) {
            const traversal = this.scorePath[index] as Traversal;
            for (let j = 0; j < traversal.right; ++j) {
                gItem = new GameScoreItem(current);
                gItem.getType(previous);
                items.push(gItem);
                previous = gItem;
                current = current.next();
            }
            if (traversal.down > 0) {
                const variations = current.variations() as KVariation[];
                if (variations.length > (traversal.down - 1)) {
                    const variation = variations[traversal.down - 1];
                    current = variation.first();
                    console.log('Branching at ' + current.notation());
                    gItem = new GameScoreItem(current);
                    gItem.getType(previous);
                    items.push(gItem);
                    previous = gItem;
                    current = current.next();
                }
            }
        }
        while (current) {
            gItem = new GameScoreItem(current);
            gItem.getType(previous);
            items.push(gItem);
            previous = gItem;
            current = current.next();
        }
        if (items.length > 0) {
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
        this.aria.redrawBoard();
    }


    public moveToPrevious(previousNode: KNode, current: KNode): ChessMove | null {
        if (this.currentNode) {
            const previousPosition = this.currentNode.positionBefore();
            if (previousPosition && this.currentNode) {
                const moveToBeUndone = ChessMove.fromNode(this.currentNode) as ChessMove;
                this.aria.updateStatus(this.position.turn(), previousNode);
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
            this.aria.updateStatus(this.position.turn(), next);
            ++this.currentIndex;
            return true;
        }
        return false;
    }
    public unPlay(current: KNode, previous: KNode): boolean {
        if (previous) {
            this.position = previous.position();
            this.currentNode = previous;
            --this.currentIndex;
            this.aria.updateStatus(this.position.turn(), previous);
            return true;
        }
        return false;
    }

    public createVariation(move: MoveDescriptor | string): boolean {
        if (this.currentNode) {
            const variationsBefore = this.currentNode.variations();
            const variation = this.currentNode.addVariation(false);
            this.currentNode = variation.play(move);
            this.position = this.currentNode.position();
            this.scorePath.push({ right: this.currentIndex, down: variationsBefore.length + 1 });
            this.currentIndex = 0;
            this.aria.updateStatus(this.position.turn(), this.currentNode, move);
            // tell it to restore gamescore
            this.aria.gameScoreItemsChanged(this.generateGameScore());
            this.aria.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public addMoveToEnd(move: MoveDescriptor): boolean {
        if (this.currentNode && this.position.play(move)) {
            const next = this.currentNode.play(move);
            this.currentNode = next;
            this.position = this.currentNode.position();
            this.aria.updateStatus(this.position.turn(), this.currentNode);
            // tell it to restore gamescore
            this.aria.gameScoreItemsChanged([]);
            this.aria.gameScoreItemsChanged(this.generateGameScore());
            this.aria.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public makeVariantMove(index: number, node: KNode, updateBoard = false): boolean {
        const variations = node.variations();
        if (index >= 0 && index < variations.length) {
            const variation = variations[index];
            this.currentNode = variation.first();
            this.position = this.currentNode.position();
            this.aria.updateStatus(this.position.turn(), this.currentNode);
            this.scorePath.push({ right: this.currentIndex, down: index + 1 });
            this.currentIndex = 0;
            if (updateBoard) {
                this.aria.makeBoardMove(ChessMove.fromNode(this.currentNode));
            }
            this.aria.updateStatus(this.position.turn(), this.currentNode);
            // tell it to restore gamescore
            this.aria.gameScoreItemsChanged(this.generateGameScore());
            this.aria.incrementGameScoreSelection();
            return true;
        }
        return false;
    }

    public makeMoveOrVariation(nextMove: KNode, moveToBeMade: ChessMove, legalMove: MoveDescriptor | string): boolean {
        let valid = false;
        if (nextMove && moveToBeMade.compareMoveToNode(nextMove)) {
            valid = this.position.play(legalMove);
            this.aria.incrementGameScoreSelection();
            this.currentNode = nextMove;
            ++this.currentIndex;
        } else {
            // search through all the variant moves, if
            if (nextMove) {
                const variations = nextMove.variations();
                for (let index = 1; index <= variations.length; ++index) {
                    const variation = variations[index - 1];
                    const variantMove = variation.first();
                    if (moveToBeMade.compareMoveToNode(variantMove)) {
                        return this.makeVariantMove(index - 1, nextMove);
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
        if (legal) {
            if (legal.status == 'promotion') {
                move.promoteFunction = legal;
                this.aria.showPromotionDialog(move);
                return true;
            }
            const legalMove = legal();
            if (this.currentNode == null) {
                this.currentNode = this.startNode;
                return this.makeMoveOrVariation(this.currentNode, move, legalMove);
            }
            const nextMove = this.currentNode.next();
            if (!nextMove) {
                return this.addMoveToEnd(legalMove);
            }
            console.log("Next Move ->" + nextMove.notation());
            lastNode = this.currentNode;
            return this.makeMoveOrVariation(nextMove, move, legalMove);

        }
        return false;
    }


    public resetEngine(): void {
        this.position = this.game.mainVariation().initialPosition();
        this.currentIndex = 0;
        this.currentNode = null;
        this.aria.updateStatus(this.position.turn());
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

