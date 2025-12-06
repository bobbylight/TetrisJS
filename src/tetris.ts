import { LoadingState } from './states/loading-state.ts';
import { TetrisGame } from './tetris-game.ts';
import * as Constants from './constants.ts';

/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
const CANVAS_WIDTH: number = Constants.SCREEN_WIDTH;
const CANVAS_HEIGHT: number = Constants.SCREEN_HEIGHT;

declare global {
    interface Window {
        game?: TetrisGame;
        init: (parent: string, assetRoot?: string) => void;
    }
}

window.init = function(parent: string, assetRoot?: string) {
    window.game = new TetrisGame({
        parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        assetRoot: assetRoot, targetFps: 60,
    });
    window.game.setState(new LoadingState(window.game));
    window.game.start();
};
window.init('app');
