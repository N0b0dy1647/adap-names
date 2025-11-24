import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    
    public asString(delimiter: string = this.delimiter): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        
        
        const unescaped = components.map(c => this.unescapeComponent(c));
        
        
        if (delimiter === "") {
            return unescaped.join("");
        }
        
        
        if (delimiter !== this.delimiter) {
            return unescaped.map(c => 
                c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                 .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter)
            ).join(delimiter);
        }
        
        
        return unescaped.join(delimiter);
    }
    
    private unescapeComponent(component: string): string {
        let result = "";
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                
                result += component[i + 1];
                i += 2;
            } else {
                result += component[i];
                i++;
            }
        }
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            components.push(
                c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                 .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER)
            );
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    protected checkRangeAndTypeErrEqual(i: number, c: string) {
        if (c === null || c === undefined) {
            throw new TypeError("Component cannot be null or undefined");
        }
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.getNoComponents()} components`);
        }
    }

    protected checkRangeAndTypeErr(i: number, c: string) {
        if (c === null || c === undefined) {
            throw new TypeError("Component cannot be null or undefined");
        }
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.getNoComponents()} components`);
        }
    }

    protected checkRangeErrEqual(i: number) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.getNoComponents()} components`);
        }
    }

    protected checkTypeErr(c: string) {
        if (c === null || c === undefined) {
            throw new TypeError("Component cannot be null or undefined");
        }
    }



    abstract clone(): Name;
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
