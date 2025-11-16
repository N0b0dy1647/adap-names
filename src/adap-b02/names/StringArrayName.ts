import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(name: string | string[], delimiter = ".") {
        this.delimiter = delimiter;

        if (Array.isArray(name)) {
            this.components = [...name];
        } else {
            this.components = this.parse(name);
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        //throw new Error("needs implementation or deletion");
        return this.components.map( c => c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER).replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter) ).join(this.delimiter);
    }

    public asDataString(): string {
        return this.components.map(c => c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER).replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);  
    }

    public getDelimiterCharacter(): string {
        //throw new Error("needs implementation or deletion");
        return this.delimiter;
    }

    public isEmpty(): boolean {
        //throw new Error("needs implementation or deletion");
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        //throw new Error("needs implementation or deletion");
        return this.components.length;
    }

    public getComponent(i: number): string {
        //throw new Error("needs implementation or deletion");
        if(i < 0 || i >= this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        if(i < 0 || i >= this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);
        }
        this.components[i]= c;
    }

    public insert(i: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        if(i < 0 || i > this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);   
        }   
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        //throw new Error("needs implementation or deletion");
        this.components.push(c);
    }

    public remove(i: number): void {
        //throw new Error("needs implementation or deletion");
        if(i < 0 || i >= this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);
        }   
        this.components.splice(i,1);    
    }

    public concat(other: Name): void {
        //throw new Error("needs implementation or deletion");
        for(let i = 0; i < other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }   
    }

    private parse(name: string): string[] {
        return name.split(this.delimiter);
    }

}