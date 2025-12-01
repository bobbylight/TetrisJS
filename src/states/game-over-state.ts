import { Score } from '../score.ts';
import { TetrisGame } from '../tetris-game.ts';
import { TitleState } from './title-state.ts';
import { BaseState } from './base-state.ts';
import { MainGameState } from './main-game-state.ts';

export class GameOverState extends BaseState {
    scores: Score[];
    enterPressed: boolean;

    constructor(game: TetrisGame, private readonly mainGameState: MainGameState) {
        super(game);
        this.scores = [];
        this.enterPressed = false;
    }

    override enter() {
        this.game.stopAndResetMidi();
        this.enterPressed = false;
    }

    override handleDefaultKeys() {
        const im = this.game.inputManager;

        if (im.enter(true)) {
            // TODO: Port EnterNameState from Java game one day, if score is high enough
            this.game.setState(new TitleState(this.game));
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.mainGameState.render(ctx);
        this.paintBigText('Game Over', ctx);
    }

    override update(delta: number) {
        super.update(delta);
        this.handleDefaultKeys();
    }
}
