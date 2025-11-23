import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source];
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.checkRangeErrEqual(i)
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.checkRangeAndTypeErrEqual(i , c)
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.checkRangeAndTypeErr(i , c)
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.checkTypeErr(c);
        this.components.push(c);
    }

    public remove(i: number): void {
        this.checkRangeErrEqual(i)
        this.components.splice(i, 1);
    }
}
