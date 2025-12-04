import { afterEach, it, describe, expect, vi, beforeEach, MockInstance } from 'vitest';
import { TetrisGame } from "../tetris-game.ts";
import { TitleState } from "./title-state.ts";

describe('TitleState', () => {
    let game: TetrisGame;
    let titleState: TitleState;

    beforeEach(() => {
        game = new TetrisGame();
        titleState = new TitleState(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('handleInput()', () => {
        let setStateSpy: MockInstance<TetrisGame['setState']>;

        beforeEach(() => {
            setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});
        });

        it('does not change state if Enter is not pressed', () => {
            const enterSpy = vi.spyOn(game.inputManager, 'enter')
                .mockImplementation(() => {
                    return false;
                });
            titleState.handleInput();
            expect(enterSpy).toHaveBeenCalledExactlyOnceWith(true);
            expect(setStateSpy).not.toHaveBeenCalled();
        });

        it('changes state if Enter is pressed', () => {
            const enterSpy = vi.spyOn(game.inputManager, 'enter')
                .mockImplementation(() => {
                    return true;
                });
            titleState.handleInput();
            expect(enterSpy).toHaveBeenCalledExactlyOnceWith(true);
            expect(setStateSpy).toHaveBeenCalledOnce();
        });
    });

    it('update()/render() loop renders an image for the playfield', () => {
        const ctx = game.getRenderingContext();
        vi.spyOn(ctx, 'setTransform').mockImplementation(() => {});
        titleState.enter();
        titleState.update();
        expect(() => {
            titleState.render(ctx);
        }).not.toThrowError();
    });
});
