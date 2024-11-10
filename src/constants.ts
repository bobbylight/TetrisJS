export class Constants  {
    static readonly HEIGHT_IN_BLOCKS = 20;
    static readonly WIDTH_IN_BLOCKS = 10;
    static readonly SCREEN_WIDTH = 640;
    static readonly SCREEN_HEIGHT = 480;
    static readonly BLOCK_SIZE = 22;
    static readonly EDGE_SIZE = 5;
    static readonly DROP_AREA_HEIGHT = 20 * 22; // HEIGHT_IN_BLOCKS * BLOCK_SIZE
    static readonly DROP_AREA_WIDTH = 10 * 22;  // WIDTH_IN_BLOCKS * BLOCK_SIZE
    static readonly BORDER_X = 20;
    static readonly BORDER_Y = (480 - (20 * 22)) / 2; // (SCREEN_HEIGHT - DROP_AREA_HEIGHT) / 2
    static readonly TEXT_AREA_X = 20 + (10 * 22) // BORDER_X + DROP_AREA_WIDTH
};
