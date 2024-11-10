import LoadingState from './states/loading-state.ts';
import TetrisGame from './tetris-game.ts';
import { Constants } from './constants.ts';


/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
const CANVAS_WIDTH: number = Constants.SCREEN_WIDTH;
const CANVAS_HEIGHT: number = Constants.SCREEN_HEIGHT;

(window as any).init = function (parent: HTMLElement, assetRoot?: string) {
    const gameWindow: any = window as any;
    gameWindow.game = new TetrisGame({
        parent: parent, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
        assetRoot: assetRoot, keyRefreshMillis: 300, targetFps: 60
    });
    gameWindow.game.setState(new LoadingState());
    gameWindow.game.start();
};
(window as any).init('app');
