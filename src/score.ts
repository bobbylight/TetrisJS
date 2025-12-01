export class Score {
    private readonly name: string;
    private readonly score: string;
    private readonly level: string;
    private readonly date: Date;

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
