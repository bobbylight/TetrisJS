import { TetrisGame } from '../tetris-game.ts';
import { SOUNDS } from '../Sounds.ts';
import { ImageBlockRenderStrategy, IMAGE_COLORS } from '../image-block-render-strategy.ts';
import { TitleState } from './title-state.ts';
import { BaseState } from './base-state.ts';

export class LoadingState extends BaseState {
    private assetsLoaded: boolean;

    constructor(game: TetrisGame) {
        super(game);
        this.assetsLoaded = false;
    }

    override render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
    }

    override update() {
        this.handleDefaultKeys();

        if (!this.assetsLoaded) {
            this.startLoadingAssets();
            this.assetsLoaded = true;
        }
    }

    private startLoadingAssets() {

        const game: TetrisGame = this.game;

        // Load assets used by this state first
        game.assets.addImage('loading', 'img/loadingMessage.png');
        game.assets.onLoad(() => {

            void game.assets.addSound(SOUNDS.GAME_OVER, `sounds/${SOUNDS.GAME_OVER}`);
            void game.assets.addSound(SOUNDS.LEVEL_UP, `sounds/${SOUNDS.LEVEL_UP}`);
            void game.assets.addSound(SOUNDS.LINES_CLEARING, `sounds/${SOUNDS.LINES_CLEARING}`);
            void game.assets.addSound(SOUNDS.PAUSED, `sounds/${SOUNDS.PAUSED}`);
            void game.assets.addSound(SOUNDS.PIECE_LANDING, `sounds/${SOUNDS.PIECE_LANDING}`);
            void game.assets.addSound(SOUNDS.PIECE_ROTATING, `sounds/${SOUNDS.PIECE_ROTATING}`);

            IMAGE_COLORS.forEach((color) => {
                game.assets.addImage(color, `img/${color}.png`);
            });

            game.assets.onLoad(() => {
                void(async() => {
                    // TODO: Move font loading into gtp
                    const f = new FontFace('SF Arch Rival', 'url("fonts/SF Arch Rival.ttf")');
                    await f.load();
                    document.fonts.add(f);
                    this.game.font = `20px ${f.family}`;
                    this.game.brs = new ImageBlockRenderStrategy(this.game);

                    this.game.setState(new TitleState(game));
                })();
            });
        });
    }
}
