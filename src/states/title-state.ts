import { Keys } from 'gtp';
import { Piece } from '../piece.ts';
import { Score } from '../score.ts';
import * as Constants from '../constants.ts';
import * as PieceFactory from '../piece-factory.ts';
import { TetrisGame } from '../tetris-game.ts';
import { MainGameState } from './main-game-state.ts';
import { BaseState } from './base-state.ts';

const FALLING_PIECE_SCALE = 1.5;
const PIECE_ALPHA = 0.2;
const HIGH_SCORES_MARGIN = 150;

export class TitleState extends BaseState {

    private font: string;
    private readonly fallingPieces: Piece[];
    private fallOffset: number;
    private readonly composite: CanvasRenderingContext2D['globalAlpha'];
    private readonly fallingPiecesTrans: DOMMatrixReadOnly;
    private lastFlashTime: number;
    private flashState: boolean;
    private tick: number;
    private tickInc: number;
    private scoresFont: string;
    private scores: Score[] | null;
    private scoresError: string | null;

    constructor(tetris: TetrisGame) {
        super(tetris);
        this.font = tetris.font;
        this.scoresFont = tetris.font;
        this.fallingPieces = [];
        this.scores = null;
        this.scoresError = null;
        this.fallOffset = 0;
        this.lastFlashTime = 0;
        this.flashState = true;
        this.tick = 1.0;
        this.tickInc = 0.002;

        this.fallingPieces = [
            PieceFactory.createLetterSPiece(),
            PieceFactory.createLetterTPiece(),
            PieceFactory.createLetterZPiece(),
            PieceFactory.createLeftHookPiece(),
            PieceFactory.createLinePiece(),
            PieceFactory.createRightHookPiece(),
            PieceFactory.createSquarePiece(),
        ];
        this.fallingPiecesTrans = new DOMMatrix().scale(FALLING_PIECE_SCALE, FALLING_PIECE_SCALE);

        this.composite = PIECE_ALPHA;
    }

    override enter() {
        // TODO: Check high scores when backend is set up, like we did with the old AWT version

        this.font = this.game.font;
        this.scoresFont = this.font;

        this.game.startNewGame();
        this.fallOffset = 0;
        this.lastFlashTime = 0;
        this.flashState = true;
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.clearScreen(ctx);
        this.paintFallingPieces(ctx);

        const width = Constants.SCREEN_WIDTH;
        let y = 20;
        this.paintTitle(ctx, y);

        const oldFont = ctx.font;
        const highScores = 'High Scores';

        ctx.font = this.scoresFont;
        ctx.fillStyle = 'yellow';
        y = 190;
        const fm = ctx.measureText(highScores);
        const w = fm.width;
        const x = this.drawStringCentered(ctx, highScores, y);

        // Draw the "high scores" bounding box
        ctx.strokeStyle = 'lightgray';
        const x0 = HIGH_SCORES_MARGIN - 10;
        y = y - (fm.actualBoundingBoxAscent + fm.actualBoundingBoxDescent) / 2;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x - 10, y);
        ctx.moveTo(x + w + 10, y);
        ctx.lineTo(width - x0, y);
        ctx.closePath();
        ctx.stroke();

        const endY = y + 24 * 8 + 10;
        ctx.beginPath();
        ctx.moveTo(x0, endY);
        ctx.lineTo(width - x0, endY);
        ctx.closePath();
        ctx.stroke();

        const scores = this.getScores();
        if (scores) {
            ctx.fillStyle = 'white';
            const count = Math.min(scores.length, 10);
            for (let i = 0; i < count; i++) {
                const rhs = width - x;
                y += 24;
                ctx.fillText(`${i + 1}. ${scores[i].getName()}`, x, y);
                const score = scores[i].getScore();
                ctx.fillText(score, rhs - fm.width, y);
            }
        }
        else if (this.scoresError) {
            ctx.fillText(this.scoresError, x, y);
        }

        ctx.fillStyle = 'lightgray';
        this.drawStringCentered(ctx, "Out on Bail Games", 460);

        if (this.flashState) {
            ctx.fillStyle = 'red';
            ctx.font = this.font;
            this.drawStringCentered(ctx, "Press Enter", 430);
        }

        ctx.font = oldFont;
    }

    override update() {
        this.handleInput();

        this.fallOffset++;if (this.fallOffset === Constants.SCREEN_HEIGHT) {
            this.fallOffset = 0;
        }

        const time = Date.now();
        if (time >= this.lastFlashTime + 1000) {
            this.lastFlashTime = time;
            this.flashState = !this.flashState;
        }
    }

    private getScores(): Score[] | null {
        return this.scores;
    }

    handleInput() {
        const im = this.game.inputManager;
        super.handleDefaultKeys();

        if (im.isKeyDown(Keys.KEY_ENTER, true)) {
            this.game.setState(new MainGameState(this.game));
        }
    }

    private paintFallingPiece(ctx: CanvasRenderingContext2D, piece: number, x: number, y: number, scale: number) {
        this.game.paintPiece(ctx, this.fallingPieces[piece], x, (y + this.fallOffset) % Constants.SCREEN_HEIGHT);

        const height = this.fallingPieces[piece].getHeight() * scale;
        const offScreen = Constants.SCREEN_HEIGHT - (y + this.fallOffset + height);
        if (offScreen < 0) {
            this.game.paintPiece(ctx, this.fallingPieces[piece], x, -(height + offScreen));
        }
    }

    private paintFallingPieces(ctx: CanvasRenderingContext2D) {
        const oldComp = ctx.globalAlpha;
        ctx.globalAlpha = this.composite;

        const oldTrans = ctx.getTransform();
        ctx.setTransform(this.fallingPiecesTrans);

        this.paintFallingPiece(ctx, 0, 30, 240, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 1, 100, 20, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 2, 330, 390, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 3, 345, 190, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 4, 515, 100, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 5, 245, 70, FALLING_PIECE_SCALE);
        this.paintFallingPiece(ctx, 6, 170, 320, FALLING_PIECE_SCALE);

        ctx.setTransform(oldTrans);
        ctx.globalAlpha = oldComp;
    }

    private paintT(ctx: CanvasRenderingContext2D, x: number, y: number, color: number): number {
        const s = Constants.BLOCK_SIZE;
        for (let i = 0; i < 5; i++) {
            this.game.paintBlock(ctx, x + i * s, y, color);
        }
        x += 2 * s;
        for (let i = 1; i < 6; i++) {
            this.game.paintBlock(ctx, x, y + i * s, color);
        }
        return 6 * s;
    }

    private paintTitle(ctx: CanvasRenderingContext2D, y: number) {
        const TITLE_WIDTH = 28 * Constants.BLOCK_SIZE;
        const margin = (Constants.SCREEN_WIDTH - TITLE_WIDTH) / 2;
        const oldTrans = ctx.getTransform();
        ctx.translate(TITLE_WIDTH / 2 + margin, Constants.SCREEN_HEIGHT / 2 + y);
        ctx.scale(this.tick, this.tick);
        this.tick += this.tickInc;
        if (this.tick >= 1.02 || this.tick <= 0.98) {
            this.tickInc = -this.tickInc;
        }

        let x = -TITLE_WIDTH / 2;
        y = -Constants.SCREEN_HEIGHT / 2;

        let color = 0;
        x += this.paintT(ctx, x, y, color);
        const s = Constants.BLOCK_SIZE;

        color = 1;
        for (let i = 0; i < 4; i++) {
            this.game.paintBlock(ctx, x + i * s, y, color);
            this.game.paintBlock(ctx, x + i * s, y + 2 * s, color);
            this.game.paintBlock(ctx, x + i * s, y + 5 * s, color);
        }
        this.game.paintBlock(ctx, x, y + 1 * s, color);
        this.game.paintBlock(ctx, x, y + 3 * s, color);
        this.game.paintBlock(ctx, x, y + 4 * s, color);
        x += 5 * s;

        color = 2;
        x += this.paintT(ctx, x, y, color);

        color = 3;
        this.game.paintBlock(ctx, x, y + 1 * s, color);
        this.game.paintBlock(ctx, x + 1 * s, y, color);
        this.game.paintBlock(ctx, x + 2 * s, y, color);
        this.game.paintBlock(ctx, x + 3 * s, y, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 1 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 2 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 3 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 4 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 5 * s, color);
        this.game.paintBlock(ctx, x + 1 * s, y + 2 * s, color);
        this.game.paintBlock(ctx, x + 2 * s, y + 2 * s, color);
        this.game.paintBlock(ctx, x + 2 * s, y + 3 * s, color);
        this.game.paintBlock(ctx, x + 1 * s, y + 4 * s, color);
        this.game.paintBlock(ctx, x, y + 5 * s, color);
        x += 5 * s;

        color = 4;
        for (let i = 0; i < 6; i++) {
            this.game.paintBlock(ctx, x, y + i * s, color);
        }
        x += 2 * s;

        color = 5;
        this.game.paintBlock(ctx, x + 1 * s, y, color);
        this.game.paintBlock(ctx, x + 2 * s, y, color);
        this.game.paintBlock(ctx, x + 3 * s, y, color);
        this.game.paintBlock(ctx, x, y + 1 * s, color);
        this.game.paintBlock(ctx, x + 1 * s, y + 2 * s, color);
        this.game.paintBlock(ctx, x + 2 * s, y + 2 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 3 * s, color);
        this.game.paintBlock(ctx, x + 3 * s, y + 4 * s, color);
        this.game.paintBlock(ctx, x, y + 4 * s, color);
        this.game.paintBlock(ctx, x + 1 * s, y + 5 * s, color);
        this.game.paintBlock(ctx, x + 2 * s, y + 5 * s, color);

        ctx.setTransform(oldTrans);
    }

    scoresRetrieved(scores: Score[], error: string) {
        this.scores = scores;
        this.scoresError = error;
    }
}
