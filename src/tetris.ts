import { LoadingState } from './states/loading-state.ts';
import { TetrisGame } from './tetris-game.ts';
import * as Constants from './constants.ts';

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
const CANVAS_WIDTH: number = Constants.SCREEN_WIDTH;
const CANVAS_HEIGHT: number = Constants.SCREEN_HEIGHT;

const game = new TetrisGame({
    parent: 'app', width: CANVAS_WIDTH, height: CANVAS_HEIGHT, targetFps: 60,
});
game.setState(new LoadingState(game));
game.start();
