import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;
    
    constructor(source: string, delimiter?: string) {
        
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "Source string cannot be null or undefined"
        );
        
        
        if (delimiter !== undefined) {
            IllegalArgumentException.assert(
                delimiter !== null && delimiter.length === 1,
                "Delimiter must be exactly one character"
            );
        }
        
        super(delimiter);
        
        this.name = source;
        
        if (source === "") {
            this.noComponents = 1;
        } else {
            this.noComponents = this.parseComponents(source).length;
        }
        
        
        this.validateStringMasking(source);
        
        
        this.assertClassInvariants();
    }
    
  
    private validateStringMasking(str: string): void {
        if (str === "") return;
        
        let i = 0;
        while (i < str.length) {
            if (str[i] === ESCAPE_CHARACTER) {
                
                IllegalArgumentException.assert(
                    i + 1 < str.length,
                    "String contains dangling escape character"
                );
                i += 2;
            } else {
                i++;
            }
        }
    }
    
    private parseComponents(str: string): string[] {
        if (str === "") {
            return [""];
        }
        
        const components: string[] = [];
        let current = "";
        let i = 0;
        
        while (i < str.length) {
            if (str[i] === ESCAPE_CHARACTER && i + 1 < str.length) {
                current += str[i] + str[i + 1];
                i += 2;
            } else if (str[i] === this.delimiter) {
                components.push(current);
                current = "";
                i++;
            } else {
                current += str[i];
                i++;
            }
        }
        components.push(current);
        
        return components;
    }
    
    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }
    
    public getNoComponents(): number {
        return this.noComponents;
    }
    
    public getComponent(i: number): string {
        this.checkRangeErrEqual(i);
        return this.parseComponents(this.name)[i];
    }
    
    public setComponent(i: number, c: string): void {
        this.checkRangeAndTypeErrEqual(i, c);
        
        
        this.validateMasking(c);
        
        const components = this.parseComponents(this.name);
        
        components[i] = c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                         .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        this.rebuildFromComponents(components);
        
        
        this.assertClassInvariants();
    }
    
    public insert(i: number, c: string): void {
        this.checkRangeAndTypeErr(i, c);
        
        
        this.validateMasking(c);
        
        
        if (this.noComponents === 0) {
            const escaped = c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                             .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
            this.name = escaped;
            this.noComponents = 1;
            this.assertClassInvariants();
            return;
        }
        
        const components = this.parseComponents(this.name);
        
        const escaped = c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                         .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        components.splice(i, 0, escaped);
        this.rebuildFromComponents(components);
        
        
        this.assertClassInvariants();
    }
    
    public append(c: string): void {
        this.checkTypeErr(c);
        
        
        this.validateMasking(c);
        
        if (this.noComponents === 0) {
            const escaped = c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                             .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
            this.name = escaped;
            this.noComponents = 1;
            this.assertClassInvariants();
            return;
        }
        
        const components = this.parseComponents(this.name);
        const escaped = c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                         .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        components.push(escaped);
        this.rebuildFromComponents(components);
        
        
        this.assertClassInvariants();
    }
    
    public remove(i: number): void {
        this.checkRangeErrEqual(i);
        const components = this.parseComponents(this.name);
        components.splice(i, 1);
        
        if (components.length === 0) {
            this.name = "";
            this.noComponents = 0;
        } else {
            this.rebuildFromComponents(components);
        }
        
        
        this.assertClassInvariants();
    }
    
    private rebuildFromComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }
}