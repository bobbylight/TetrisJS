import { Game, GameArgs } from 'gtp';
import { BlockRenderStrategy } from './block-render-strategy.ts';
import { Board } from './board.ts';
import { Piece } from './piece.ts';
import * as PieceFactory from './piece-factory.ts';
import { SOUNDS } from './Sounds.ts';
import { MainGameState } from './states/main-game-state.ts';
import * as Constants from './constants.ts';
import { LoadingState } from './states/loading-state.ts';
import { SolidBlockRenderStrategy } from './solid-block-render-strategy.ts';
import { ImageBlockRenderStrategy } from './image-block-render-strategy.ts';

/**
 * The actual game engine.
 */
export class TetrisGame extends Game {

    brs: BlockRenderStrategy;
    private readonly bigMessageFont: string;
    font: string;
    private readonly board: Board;
    private fallingPiece: Piece | null;
    private nextPiece: Piece;
    private level: number;
    private linesCleared: number;
    private score: number;
    private showNextPiece: boolean;
    private paintFancyBoard: boolean;

    static readonly LINE_CLEAR_SCORE = [ 40, 100, 300, 1200 ];

    constructor(args?: GameArgs) {
        super(args);

        this.brs = new SolidBlockRenderStrategy();
        this.bigMessageFont = 'bold italic 72px Sans Serif';
        this.font = '18px Sans Serif'; // Fallback in case font fails to load
        this.board = new Board(this);
        this.fallingPiece = null;
        this.nextPiece = this.createRandomPiece();
        this.level = 0;
        this.linesCleared = 0;
        this.score = 0;
        this.showNextPiece = true;
        this.paintFancyBoard = true;

        this.statusMessageRGB = '#ffffff';
        this.setState(new LoadingState(this));
    }

    private createRandomPiece(): Piece {
        const type = this.randomInt(7) + 1; // Random piece type between 1 and 7
        return PieceFactory.createPiece(type);
    }

    startNewGame() {
        this.board.clear();
        this.level = 0;
        this.linesCleared = 0;
        this.score = 0;
    }

    createNewFallingPiece(): Piece {
        this.fallingPiece = this.nextPiece;
        this.nextPiece = this.createRandomPiece();
        return this.fallingPiece;
    }

    getPaintFancyBoard(): boolean {
        return this.paintFancyBoard;
    }

    setPaintFancyBoard(fancy: boolean) {
        this.paintFancyBoard = fancy;
    }

    getBigMessageFont(): string {
        return this.bigMessageFont;
    }

    // Gets the board object
    getBoard(): Board {
        return this.board;
    }

    getColorForPiece(piece: number): number {
        return piece - 1;
    }

    // Drops the falling piece
    dropFallingPiece() {
        if (this.fallingPiece && !this.fallingPiece.fall(this.board)) {
            this.fallingPiece = null;
            if (this.board.startClearing()) {
                const state = this.state as MainGameState;
                state.setSubstate(MainGameState.SUBSTATE_LINES_CLEARING);
            }
        }
    }

    getFallingPiece(): Piece | null {
        return this.fallingPiece;
    }

    getFallTimeDelta(): number {
        // Formula:
        // Level 0:  1 drop / 1 second
        // Level 20: 1 drop / 0.1 seconds
        // => Decrease by 0.9 seconds in 20 levels
        // => Each level, drop time decreases by (0.045 * level) seconds
        const level = Math.min(this.getLevel(), 22); // Prevent negative times
        return 1000 - level * 0.045 * 1000;
    }

    getLinesCleared(): number {
        return this.linesCleared;
    }

    getNextPiece(): Piece {
        return this.nextPiece;
    }

    getShowNextPiece(): boolean {
        return this.showNextPiece;
    }

    // Return the player's score
    getScore(): number {
        return this.score;
    }

    // Return the level the player is at
    getLevel(): number {
        return this.level;
    }

    // Update score based on cleared lines
    setLinesCleared(count: number) {
        const LINE_CLEAR_SCORE = [ 40, 100, 300, 1200 ];
        this.score += LINE_CLEAR_SCORE[count - 1] * (this.level + 1);
        this.linesCleared += count;
        if (this.linesCleared >= (this.level + 1) * 10) {
            this.level++;
            this.audio.playSound(SOUNDS.LEVEL_UP, false);
        }
    }

    paintBlock(ctx: CanvasRenderingContext2D, x: number, y: number, c: number) {
        this.brs.paint(ctx, x, y, c);
    }

    paintBlockInDropArea(ctx: CanvasRenderingContext2D, col: number, row: number, c: number) {
        const x = Constants.BORDER_X + col * Constants.BLOCK_SIZE;
        const y = Constants.BORDER_Y + row * Constants.BLOCK_SIZE;
        this.paintBlock(ctx, x, y, c);
    }

    paintPiece(ctx: CanvasRenderingContext2D, piece: Piece, x: number, y: number) {
        for (let i = 0; i < 4; i++) {
            const row = piece.getPieceRow(i);
            const col = piece.getPieceColumn(i);
            this.paintBlock(ctx, x + col * Constants.BLOCK_SIZE, y + row * Constants.BLOCK_SIZE,
                this.getColorForPiece(piece.getType()));
        }
    }

    paintPieceInDropArea(ctx: CanvasRenderingContext2D, piece: Piece) {
        for (let i = 0; i < 4; i++) {
            const row = piece.getBoardRow(i);
            const col = piece.getBoardColumn(i);
            this.paintBlockInDropArea(ctx, col, row, this.getColorForPiece(piece.getType()));
        }
    }

    // Plays the classic Tetris theme using Web Audio API or MIDI
    playMidi() {
        // TODO: Implement me
    }

    setShowNextPiece(show: boolean) {
        this.showNextPiece = show;
    }

    // Stops and resets the MIDI (if using Web Audio API, stop and reset logic would go here)
    stopAndResetMidi() {
        // TODO: Implement me
    }

    toggleBlockRenderStrategy() {
        if (this.brs instanceof ImageBlockRenderStrategy) {
            this.brs = new SolidBlockRenderStrategy();
        }
        else {
            this.brs = new ImageBlockRenderStrategy(this);
        }
    }
}
