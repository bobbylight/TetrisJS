import BaseState from './base-state.ts';
import TetrisGame from '../tetris-game.ts';
import { BaseStateArgs } from 'gtp';
import { Sounds } from '../sounds.ts';
import TitleState from './title-state.ts';
import ImageBlockRenderStrategy, { IMAGE_COLORS } from '../image-block-render-strategy.ts';

export default class LoadingState extends BaseState {
    private assetsLoaded: boolean;

    constructor(args?: TetrisGame | BaseStateArgs<TetrisGame>) {
        super(args);
        this.assetsLoaded = false;
    }

    override render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
    }

    override update(_delta: number) {
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

            game.assets.addSound(Sounds.GAME_OVER, `sounds/${Sounds.GAME_OVER}`);
            game.assets.addSound(Sounds.LEVEL_UP, `sounds/${Sounds.LEVEL_UP}`);
            game.assets.addSound(Sounds.LINES_CLEARING, `sounds/${Sounds.LINES_CLEARING}`);
            game.assets.addSound(Sounds.PAUSED, `sounds/${Sounds.PAUSED}`);
            game.assets.addSound(Sounds.PIECE_LANDING, `sounds/${Sounds.PIECE_LANDING}`);
            game.assets.addSound(Sounds.PIECE_ROTATING, `sounds/${Sounds.PIECE_ROTATING}`);

            IMAGE_COLORS.forEach(color => game.assets.addImage(color, `img/${color}.png`));

            game.assets.onLoad(async () => {
                // TODO: Move font loading into gtp
                const f = new FontFace('SF Arch Rival', 'url("fonts/SF Arch Rival.ttf")');
                await f.load();
                document.fonts.add(f);
                this.game.font = `20px ${f.family}`;
                this.game.brs = new ImageBlockRenderStrategy(this.game);

                this.game.setState(new TitleState(game));
            });
        });
    }
}
