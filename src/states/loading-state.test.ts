import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import {TetrisGame} from "../tetris-game.ts";
import {SOUNDS} from "../Sounds.ts";
import {IMAGE_COLORS} from "../image-block-render-strategy.ts";
import {LoadingState} from "./loading-state.ts";
import {TitleState} from "./title-state.ts";

const mockImage = {
    draw: vi.fn(),
    height: 5,
    width: 5,
};

const mockSpriteSheet: SpriteSheet = {
    createRecoloredCopy: () => {
        return mockImage;
    },
    gtpImage: mockImage,
} as unknown as SpriteSheet;

describe('LoadingState', () => {
    let game: TetrisGame;
    let state: LoadingState;

    beforeEach(() => {
        game = new TetrisGame();
        state = new LoadingState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('update()', () => {
        it('loads assets and sets assetsLoaded to true', () => {
            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            const onLoadSpy = vi.spyOn(game.assets, 'onLoad');
            state.enter(game);
            expect(onLoadSpy).not.toHaveBeenCalled();
            state.update();
            expect(addImageSpy).toHaveBeenCalledWith('loading', 'img/loadingMessage.png');
            expect(onLoadSpy).toHaveBeenCalled();
        });

        it('does not reload assets if already loaded', () => {
            const addImageSpy = vi.spyOn(game.assets, 'addImage');
            state.enter(game);
            state.update();
            expect(addImageSpy).toHaveBeenCalledOnce();
            state.update();
            expect(addImageSpy).toHaveBeenCalledOnce();
        });

        describe('when the loading image finishes loading', () => {
            let startNewGameSpy: MockInstance<TetrisGame['startNewGame']>;
            let setStateSpy: MockInstance<TetrisGame['setState']>;
            let addImageSpy: MockInstance<TetrisGame['assets']['addImage']>;
            let addSoundSpy: MockInstance<TetrisGame['assets']['addSound']>;

            beforeEach(() => {
                startNewGameSpy = vi.spyOn(game, 'startNewGame').mockImplementation(() => {
                });
                setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {
                });
                addImageSpy = vi.spyOn(game.assets, 'addImage').mockImplementation(() => {});
                addSoundSpy = vi.spyOn(game.assets, 'addSound').mockResolvedValue({} as unknown as ArrayBuffer);
                vi.spyOn(game.assets, 'get').mockImplementation(() => mockSpriteSheet);
                vi.spyOn(game.assets, 'onLoad').mockImplementation((callback) => {
                    callback();
                });
            });

            it('loads all game resources', () => {
                state.enter(game);
                state.update();

                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.GAME_OVER, `sounds/${SOUNDS.GAME_OVER}`);
                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.LEVEL_UP, `sounds/${SOUNDS.LEVEL_UP}`);
                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.LINES_CLEARING, `sounds/${SOUNDS.LINES_CLEARING}`);
                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.PAUSED, `sounds/${SOUNDS.PAUSED}`);
                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.PIECE_LANDING, `sounds/${SOUNDS.PIECE_LANDING}`);
                expect(addSoundSpy).toHaveBeenCalledWith(SOUNDS.PIECE_ROTATING, `sounds/${SOUNDS.PIECE_ROTATING}`);
                IMAGE_COLORS.forEach((color) => {
                    expect(addImageSpy).toHaveBeenCalledWith(color, `img/${color}.png`);
                });
            });

            it('does not start a new game directly', () => {
                state.enter(game);
                state.update();
                expect(startNewGameSpy).not.toHaveBeenCalled();
            });

            it('sets state to TitleState', async() => {
                state.enter(game);
                state.update();

                // The last onload is async
                await new Promise((resolve) => setTimeout(resolve, 5));

                expect(setStateSpy).toHaveBeenCalled();
                const arg = setStateSpy.mock.calls[0][0];
                expect(arg).toBeInstanceOf(TitleState);
            });
        });
    });
});
