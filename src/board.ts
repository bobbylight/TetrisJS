import * as Constants from './constants.ts';
import { Piece } from './piece.ts';
import { TetrisGame } from './tetris-game.ts';
import { SOUNDS } from './Sounds.ts';
import {create2DArray} from "./utils.ts";

/**
 * The "board" in which Tetris is played.
 */
export class Board {
    private readonly data: number[][];
    private rowsBeingCleared: number[];
    private clearStage: number;

    /**
     * Constructor.
     * @param tetris The game application.
     */
    constructor(private readonly tetris: TetrisGame) {
        this.data = create2DArray(Constants.HEIGHT_IN_BLOCKS, Constants.WIDTH_IN_BLOCKS, 0);
        this.rowsBeingCleared = new Array<number>(4).fill(-1);
        this.clearStage = 0;
    }

    /**
     * Clears the board for a new game. This removes all previously-fallen pieces.
     */
    clear() {
        for (let row = 0; row < this.getBoardRowCount(); row++) {
            this.data[row].fill(0);
        }
    }

    getBoardColumnCount(): number {
        return Constants.WIDTH_IN_BLOCKS;
    }

    getBoardRowCount(): number {
        return Constants.HEIGHT_IN_BLOCKS;
    }

    getData(row: number, col: number): number {
        return this.data[row][col];
    }

    getShouldStillFall(piece: Piece): boolean {
        for (let i = 0; i < 4; i++) {
            const row = piece.getBoardRow(i);
            const col = piece.getBoardColumn(i);
            if (row === this.getBoardRowCount() - 1 || this.data[row + 1][col] > 0) {
                for (let j = 0; j < 4; j++) {
                    this.data[piece.getBoardRow(j)][piece.getBoardColumn(j)] = piece.getType();
                }
                this.tetris.audio.playSound(SOUNDS.PIECE_LANDING);
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether the specified piece has collided with the pieces already landed in the board.
     * This method is used to determine if the board area has been "filled," and the user's game
     * should be over.
     *
     * @param piece The piece to check.
     * @return Whether the piece is colliding with already-fallen pieces.
     */
    getTouchesData(piece: Piece): boolean {
        for (let i = 0; i < 4; i++) {
            const row = piece.getBoardRow(i);
            const col = piece.getBoardColumn(i);
            if (this.isBlockAlreadyFilled(row, col)) {
                return true;
            }
        }
        return false;
    }

    isBlockAlreadyFilled(row: number, col: number): boolean {
        return this.data[row][col] > 0;
    }

    private removeEmptyRows() {
        let i = 0;
        while (i < 4 && this.rowsBeingCleared[i] > -1) {
            const row = this.rowsBeingCleared[i] + i;
            this.data.splice(row, 1);
            this.data.unshift(new Array<number>(this.getBoardColumnCount()).fill(0));
            i++;
        }
        this.tetris.setLinesCleared(i);
    }

    startClearing(): boolean {
        this.rowsBeingCleared.fill(-1);
        let rbcIndex = 0;
        this.clearStage = 0;

        // Check for data rows that are filled with blocks. Quit on the first row containing 0 blocks.
        for (let row = this.getBoardRowCount() - 1; row >= 0; row--) {
            let blockCount = 0;

            for (let col = 0; col < this.getBoardColumnCount(); col++) {
                if (this.data[row][col] > 0) {
                    blockCount++;
                }
            }

            if (blockCount === 0) {
                break; // Completely empty row - we can quit now.
            }
            else if (blockCount === this.getBoardColumnCount()) {
                this.rowsBeingCleared[rbcIndex++] = row;
                if (rbcIndex === 4) {
                    // Max of 4 rows can be cleared at a time, so we can quit early.
                    break;
                }
            }
        }

        const rowsCleared = rbcIndex > 0;
        if (rowsCleared) {
            this.tetris.audio.playSound(SOUNDS.LINES_CLEARING);
        }
        return rowsCleared;
    }

    updateClearing(): boolean {
        const colCount = this.getBoardColumnCount();
        if (this.clearStage >= colCount / 2) {
            this.clearStage = 0;
            this.removeEmptyRows();
            return false;
        }
        const mid = Math.floor(colCount / 2);
        let i = 0;
        while (i < 4 && this.rowsBeingCleared[i] > -1) {
            const row = this.rowsBeingCleared[i];
            if (colCount % 2 === 0) { // Even number of columns.
                this.data[row][mid + this.clearStage] = 0;
                this.data[row][mid - this.clearStage - 1] = 0;
            }
            else { // Odd number of columns.
                this.data[row][mid - this.clearStage] = 0;
                this.data[row][mid + this.clearStage] = 0;
            }
            i++;
        }
        this.clearStage++;
        return true;
    }
}
