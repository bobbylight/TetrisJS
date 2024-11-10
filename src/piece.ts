import { Constants } from './constants.ts';
import { Board } from './board.ts';

export default class Piece {

    static LEFT_HOOK = 1; // Start at 1
    static LETTER_S = 2;
    static LETTER_T = 3;
    static LETTER_Z = 4;
    static LINE = 5;
    static RIGHT_HOOK = 6;
    static SQUARE = 7;

    private data: number[][];
    private x: number;
    private y: number;
    private rotateAmt: number;
    private type: number;

    constructor(type: number, rotateStateCount: number) {
        this.type = type;
        this.data = Array.from({ length: rotateStateCount }, () => new Array(4).fill(0));
        this.x = 3;
        this.y = 0;
        this.rotateAmt = 0;
    }

    fall(board: Board): boolean {
        const stillFalling = board.getShouldStillFall(this);
        if (stillFalling) {
            this.y++;
        }
        return stillFalling;
    }

    getBoardColumn(index: number): number {
        return this.x + this.getPieceColumn(index);
    }

    getBoardRow(index: number): number {
        return this.y + this.getPieceRow(index);
    }

    getHeight(): number {
        let height = 0;
        for (let i = 0; i < 4; i++) {
            height = Math.max(height, this.getPieceRow(i));
        }
        return (height + 1) * Constants.BLOCK_SIZE; // "+1" since we're 0-based.
    }

    getLeftmostBoardColumn(): number {
        return this.x + this.getLeftmostPieceColumn();
    }

    getLeftmostPieceColumn(): number {
        let column = 5;
        for (let i = 0; i < 4; i++) {
            column = Math.min(column, this.getPieceColumn(i));
        }
        return column;
    }

    getPieceColumn(index: number): number {
        return this.data[this.rotateAmt][index] & 0xff;
    }

    getRightmostBoardColumn(): number {
        return this.x + this.getRightmostPieceColumn();
    }

    getRightmostPieceColumn(): number {
        let column = -1;
        for (let i = 0; i < 4; i++) {
            column = Math.max(column, this.getPieceColumn(i));
        }
        return column;
    }

    getPieceRow(index: number): number {
        return (this.data[this.rotateAmt][index] >> 8) & 0xff;
    }

    getType(): number {
        return this.type;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    moveLeft(board: Board): boolean {
        if (this.getLeftmostBoardColumn() > 0) {
            for (let i = 0; i < 4; i++) {
                const row = this.getBoardRow(i);
                const col = this.getBoardColumn(i) - 1;
                if (board.isBlockAlreadyFilled(row, col)) {
                    return false;
                }
            }
            this.x--;
            return true;
        }
        return false;
    }

    moveRight(board: Board): boolean {
        if (this.getRightmostBoardColumn() < Constants.WIDTH_IN_BLOCKS - 1) {
            for (let i = 0; i < 4; i++) {
                const row = this.getBoardRow(i);
                const col = this.getBoardColumn(i) + 1;
                if (board.isBlockAlreadyFilled(row, col)) {
                    return false;
                }
            }
            this.x++;
            return true;
        }
        return false;
    }

    rotate(amt: number, board: Board): boolean {
        const old = this.rotateAmt;

        // Get the new rotation amount.
        this.rotateAmt = (this.rotateAmt + amt) % this.data.length;
        if (this.rotateAmt < 0) {
            this.rotateAmt = this.data.length + this.rotateAmt;
        }

        // Ensure the piece will stay in the board's bounds if rotated.
        for (let i = 0; i < 4; i++) {
            const row = this.getBoardRow(i);
            if (row < 0 || row >= Constants.HEIGHT_IN_BLOCKS) {
                this.rotateAmt = old;
                return false;
            }
            const col = this.getBoardColumn(i);
            if (col < 0 || col >= Constants.WIDTH_IN_BLOCKS) {
                this.rotateAmt = old;
                return false;
            }
            if (board.isBlockAlreadyFilled(row, col)) {
                this.rotateAmt = old;
                return false;
            }
        }

        // We're okay to rotate.
        return true;
    }

    setData(rotateAmt: number, index: number, x: number, y: number) {
        this.data[rotateAmt][index] = (y << 8) | x;
    }
}
