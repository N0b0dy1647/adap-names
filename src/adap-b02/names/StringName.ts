import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    private components: string[] = [];  
    protected noComponents: number = 0;

    constructor(name: string, delimiter: string = ".") {
        this.delimiter = delimiter;

        this.name = name; 

        this.components = name === "" ? [""] : name.split(delimiter);

        this.noComponents = this.components.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        //throw new Error("needs implementation or deletion");
        if(delimiter === this.delimiter){
            return this.name;   
        }
        const components = this.getComponents();
        return components.join(delimiter);
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
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        //throw new Error("needs implementation or deletion");
        return this.noComponents;
    }

    public getComponent(x: number): string {
        //throw new Error("needs implementation or deletion");
        if(x < 0 || x >= this.noComponents){
            throw new RangeError(`Index ${x} out of bounds for Name with ${this.noComponents} components`);
        }
        return this.components[x];
    }

    public setComponent(n: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        if(n < 0 || n >= this.noComponents){
            throw new RangeError(`Index ${n} out of bounds for Name with ${this.noComponents} components`);
        }
        const components = this.getComponents();
        components[n] = c;
        this.rebuildName(components);
    }   

    public insert(n: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        if(n < 0 || n > this.noComponents){
            throw new RangeError(`Index ${n} out of bounds for Name with ${this.noComponents} components`);
        }
        const components = this.getComponents();
        components.splice(n, 0, c);
        this.rebuildName(components);
    }   

    public append(c: string): void {
        //throw new Error("needs implementation or deletion");
        const components = this.getComponents();
        components.push(c);
        this.rebuildName(components);
    }

    public remove(n: number): void {
        if(n < 0 || n >= this.noComponents){
            throw new RangeError(`Index ${n} out of bounds`);
        }
        const components = this.getComponents();
        components.splice(n, 1);
        if(components.length === 0){
            this.components = [];
            this.name = "";
            this.noComponents = 0;
        }else{
            this.rebuildName(components);
        }
    }

    public concat(other: Name): void {
        //throw new Error("needs implementation or deletion");
        if(other.isEmpty()){
            return;
        }   
        for(let i = 0; i < other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }


    private rebuildName(components: string[]): void {
        this.components = components;
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    private getComponents(): string[] {
        return [...this.components];
    }
}