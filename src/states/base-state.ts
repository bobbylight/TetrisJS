import { Keys, State } from 'gtp';
import { TetrisGame } from '../tetris-game.ts';
import * as Constants from '../constants.ts';

export class BaseState extends State<TetrisGame> {

    constructor(game: TetrisGame) {
        super(game);
        this.game = game;
    }

    protected clearScreen(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    }

    protected drawStringCentered(ctx: CanvasRenderingContext2D, text: string, y: number): number {
        const w = ctx.measureText(text).width;
        const x = (Constants.SCREEN_WIDTH - w) / 2;
        ctx.fillText(text, x, y);
        return x;
    }

    protected handleDefaultKeys() {
        const im = this.game.inputManager;

        if (im.isKeyDown(Keys.KEY_3, true)) {
            this.game.toggleShowFps();
        }
        else if (im.isKeyDown(Keys.KEY_4, true)) {
            this.game.setPaintFancyBoard(!this.game.getPaintFancyBoard());
        }
        else if (im.isKeyDown(Keys.KEY_5, true)) {
            this.game.toggleBlockRenderStrategy();
        }
        else if (im.isKeyDown(Keys.KEY_S, true)) {
            this.game.audio.toggleMuted();
        }
    }

    protected paintBigText(text: string, ctx: CanvasRenderingContext2D) {
        const oldFont = ctx.font;
        ctx.font = this.game.getBigMessageFont();

        const fm = ctx.measureText(text);
        const w = fm.width;
        const x = (Constants.SCREEN_WIDTH - w) / 2;
        const y = Constants.SCREEN_HEIGHT / 2;

        ctx.fillStyle = 'white';
        ctx.fillText(text, x - 2, y - 2);

        ctx.fillStyle = 'red';
        ctx.fillText(text, x + 2, y + 2);

        ctx.font = oldFont;
    }
}
