export default class Score {
    private name: string;
    private score: string;
    private level: string;
    private date: Date;

    constructor(name: string, score: number, level: number, date: Date) {
        this.name = name;
        this.score = score.toString();
        this.level = level.toString();
        this.date = date;
    }

    getDate(): Date {
        return this.date;
    }

    getLevel(): string {
        return this.level;
    }

    getName(): string {
        return this.name;
    }

    getScore(): string {
        return this.score;
    }
}
