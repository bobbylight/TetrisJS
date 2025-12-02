import { InputManager, Keys } from 'gtp';
import { TetrisGame } from '../tetris-game.ts';
import * as Constants from '../constants.ts';
import { SOUNDS } from '../Sounds.ts';
import { BaseState } from './base-state.ts';
import { GameOverState } from './game-over-state.ts';

export class MainGameState extends BaseState {

    static readonly SUBSTATE_PIECE_FALLING = 0;
    static readonly SUBSTATE_LINES_CLEARING = 1;

    private dropAreaImage: HTMLImageElement | null = null;
    protected font: string;
    private lastFallTime = 0;
    private lastClearTime = 0;
    private nextPieceX = 0;
    private substate: number = MainGameState.SUBSTATE_PIECE_FALLING;

    constructor(tetris: TetrisGame) {
        super(tetris);
        this.createDropAreaImage();
        this.font = this.game.font;
    }

    /**
     * Creates the image for the drop area.
     */
    protected createDropAreaImage() {
        const w = Constants.DROP_AREA_WIDTH + 2 * Constants.EDGE_SIZE;
        const h = Constants.DROP_AREA_HEIGHT + Constants.EDGE_SIZE;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Gradient for the drop area
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(1, 'white');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Border paint
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.2;
        ctx.fillRect(Constants.EDGE_SIZE, 0, Constants.DROP_AREA_WIDTH, Constants.DROP_AREA_HEIGHT);

        this.dropAreaImage = document.createElement('img');
        this.dropAreaImage.src = canvas.toDataURL();
    }

    override enter() {
        this.game.playMidi();
        this.font = this.game.font;
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.clearScreen(ctx);
        this.paintBoard(ctx);

        const oldFont = ctx.font;
        ctx.font = this.font;

        this.paintNextPiece(ctx);
        this.paintStats(ctx);

        ctx.font = oldFont;

        if (this.game.paused) {
            this.paintBigText('Paused', ctx);
        }
        else {
            const fallingPiece = this.game.getFallingPiece();
            if (fallingPiece) {
                this.game.paintPieceInDropArea(ctx, fallingPiece);
            }
        }
    }

    override update() {
        this.handleInput();

        if (this.game.paused) {
            return;
        }

        const currentTime = Date.now();
        let fallingPiece = this.game.getFallingPiece();
        const time = this.game.playTime;

        switch (this.substate) {
            case MainGameState.SUBSTATE_PIECE_FALLING:
                if (!fallingPiece) {
                    fallingPiece = this.game.createNewFallingPiece();
                    if (this.game.getBoard().getTouchesData(fallingPiece)) {
                        this.game.audio.playSound(SOUNDS.GAME_OVER, false);
                        this.game.setState(new GameOverState(this.game, this));
                    }
                    this.lastFallTime = this.game.playTime;
                }
                if (time >= this.lastFallTime + this.game.getFallTimeDelta()) {
                    this.lastFallTime = time;
                    this.game.dropFallingPiece();
                }
                break;

            case MainGameState.SUBSTATE_LINES_CLEARING:
                if (currentTime >= this.lastClearTime) {
                    this.lastClearTime = currentTime;
                    if (!this.game.getBoard().updateClearing()) {
                        this.substate = MainGameState.SUBSTATE_PIECE_FALLING;
                    }
                }
                break;
        }
    }

    private getDisabledTextColor(): string {
        return 'gray';
    }

    handleInput() {
        super.handleDefaultKeys();
        const im = this.game.inputManager;

        const paused = this.game.paused;
        if (paused) {
            if (im.enter(true)) {
                this.game.paused = false;
            }
        }
        else {
            switch (this.substate) {
                case MainGameState.SUBSTATE_LINES_CLEARING:
                    // Accept no input
                    break;
                case MainGameState.SUBSTATE_PIECE_FALLING:
                    this.handleInputPieceFalling(im);
                    break;
            }
        }
    }

    private handleInputPieceFalling(im: InputManager) {
        const fallingPiece = this.game.getFallingPiece();

        if (im.left(true)) {
            if (fallingPiece) {
                fallingPiece.moveLeft(this.game.getBoard());
            }
        }
        else if (im.right(true)) {
            if (fallingPiece) {
                fallingPiece.moveRight(this.game.getBoard());
            }
        }
        else if (im.down(true)) {
            this.game.dropFallingPiece();
        }
        else if (im.isKeyDown(Keys.KEY_N, true)) {
            this.game.setShowNextPiece(!this.game.getShowNextPiece());
        }
        else if (im.enter(true)) {
            this.game.paused = true;
        }

        if (im.isKeyDown(Keys.KEY_Z, true)) {
            if (fallingPiece) {
                this.game.audio.playSound(SOUNDS.PIECE_ROTATING, false);
                fallingPiece.rotate(-1, this.game.getBoard());
            }
        }
        else if (im.isKeyDown(Keys.KEY_X, true)) {
            if (fallingPiece) {
                this.game.audio.playSound(SOUNDS.PIECE_ROTATING, false);
                fallingPiece.rotate(1, this.game.getBoard());
            }
        }
    }

    protected paintBoard(ctx: CanvasRenderingContext2D) {
        this.paintDropArea(ctx);
        this.paintDropAreaFill(ctx);
    }

    private paintDropArea(ctx: CanvasRenderingContext2D) {
        const x = Constants.BORDER_X - Constants.EDGE_SIZE;
        if (this.game.getPaintFancyBoard() && this.dropAreaImage) {
            ctx.drawImage(this.dropAreaImage, x, Constants.BORDER_Y);
        }
        else {
            ctx.fillStyle = 'blue';
            this.paintDropAreaBorderImpl(ctx, x, Constants.BORDER_Y);
        }
    }

    private paintDropAreaBorderImpl(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillRect(x, y, Constants.EDGE_SIZE, Constants.DROP_AREA_HEIGHT + Constants.EDGE_SIZE);
        ctx.fillRect(x + Constants.EDGE_SIZE, y + Constants.DROP_AREA_HEIGHT, Constants.DROP_AREA_WIDTH, Constants.EDGE_SIZE);
        ctx.fillRect(x + Constants.EDGE_SIZE + Constants.DROP_AREA_WIDTH, y, Constants.EDGE_SIZE, Constants.DROP_AREA_HEIGHT + Constants.EDGE_SIZE);
    }

    protected paintDropAreaFill(ctx: CanvasRenderingContext2D) {
        const board = this.game.getBoard();
        for (let i = 0; i < board.getBoardRowCount(); i++) {
            for (let j = 0; j < board.getBoardColumnCount(); j++) {
                if (board.isBlockAlreadyFilled(i, j)) {
                    const c = this.game.getColorForPiece(board.getData(i, j));
                    this.game.paintBlockInDropArea(ctx, j, i, c);
                }
            }
        }
    }

    protected paintNextPiece(ctx: CanvasRenderingContext2D) {
        const doPaint = this.game.getShowNextPiece();
        ctx.fillStyle = doPaint ? 'white' : this.getDisabledTextColor();
        let y = 320;

        const text = 'Next Piece:';
        if (this.nextPieceX === 0) {
            const fm = ctx.measureText(text);
            const w = fm.width;
            const textAreaW = Constants.SCREEN_WIDTH - Constants.TEXT_AREA_X - Constants.BORDER_X;
            this.nextPieceX = Constants.TEXT_AREA_X + (textAreaW - w) / 2;
        }
        ctx.fillText(text, this.nextPieceX, y);

        if (doPaint) {
            const nextPiece = this.game.getNextPiece();
            const w = Constants.BLOCK_SIZE * 4;
            const textAreaW = Constants.SCREEN_WIDTH - Constants.TEXT_AREA_X - Constants.BORDER_X;
            const x = Constants.TEXT_AREA_X + (textAreaW - w) / 2;
            y += 20;
            this.game.paintPiece(ctx, nextPiece, x, y);
        }
    }

    protected paintStats(ctx: CanvasRenderingContext2D) {
        const fontHeight = ctx.measureText('M').width;
        const ascent = fontHeight;

        let x = Constants.TEXT_AREA_X + 40;
        const y = Constants.BORDER_Y + ascent;
        const yDelta = fontHeight + 5;

        ctx.fillStyle = 'white';
        ctx.fillText('Level:', x, y);
        ctx.fillText('Score:', x, y + yDelta);
        ctx.fillText('Lines:', x, y + 2 * yDelta);

        x += 150;
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.game.getLevel().toString(), x, y);
        ctx.fillText(this.game.getScore().toString(), x, y + yDelta);
        ctx.fillText(this.game.getLinesCleared().toString(), x, y + 2 * yDelta);
    }

    setSubstate(substate: number) {
        this.substate = substate;
    }
}
