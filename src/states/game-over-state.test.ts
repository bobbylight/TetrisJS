import { afterEach, it, describe, expect, vi, beforeEach, MockInstance } from 'vitest';
import { TetrisGame } from "../tetris-game.ts";
import { GameOverState } from "./game-over-state.ts";
import { MainGameState } from "./main-game-state.ts";

describe('GameOverState', () => {
    let game: TetrisGame;
    let gameOverState: GameOverState;
    let mainGameState: MainGameState;

    beforeEach(() => {
        game = new TetrisGame();
        mainGameState = new MainGameState(game);
        gameOverState = new GameOverState(game, mainGameState);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initializes scores to an empty array', () => {
            expect(gameOverState.scores).toEqual([]);
        });
    });

    describe('handleDefaultKeys()', () => {
        let setStateSpy: MockInstance<TetrisGame['setState']>;

        beforeEach(() => {
            setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});
        });

        it('does not change state if Enter is not pressed', () => {
            const enterSpy = vi.spyOn(game.inputManager, 'enter')
                .mockImplementation(() => {
                    return false;
                });
            gameOverState.handleDefaultKeys();
            expect(enterSpy).toHaveBeenCalledExactlyOnceWith(true);
            expect(setStateSpy).not.toHaveBeenCalled();
        });

        it('changes state if Enter is pressed', () => {
            const enterSpy = vi.spyOn(game.inputManager, 'enter')
                .mockImplementation(() => {
                    return true;
                });
            gameOverState.handleDefaultKeys();
            expect(enterSpy).toHaveBeenCalledExactlyOnceWith(true);
            expect(setStateSpy).toHaveBeenCalledOnce();
        });
    });

    it('update()/render() loop renders an image for the playfield', () => {
        const ctx = game.getRenderingContext();
        const drawImageMock = vi.spyOn(ctx, 'drawImage').mockImplementation(() => {});
        gameOverState.enter();
        gameOverState.update(16);
        gameOverState.render(ctx);
        expect(drawImageMock).toHaveBeenCalledTimes(1);
    });
});
