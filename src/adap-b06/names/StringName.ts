import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
    private readonly name: string;
    private readonly noComponents: number;
    private readonly isTrulyEmpty: boolean;
    
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
        
        this.isTrulyEmpty = false;
        this.noComponents = this.parseComponents(source).length;
        
        this.validateStringMasking(source);
        this.assertClassInvariants();
    }
    
    
    private static createEmpty(delimiter: string): StringName {
        const instance = Object.create(StringName.prototype);
        
        Object.defineProperty(instance, 'delimiter', {
            value: delimiter,
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(instance, 'name', {
            value: "",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(instance, 'noComponents', {
            value: 0,
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(instance, 'isTrulyEmpty', {
            value: true,
            writable: false,
            enumerable: true,
            configurable: false
        });
        return instance;
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
            return this.isTrulyEmpty ? [] : [""];
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
        if (this.isTrulyEmpty) {
            return StringName.createEmpty(this.delimiter);
        }
        return new StringName(this.name, this.delimiter);
    }
    
    public getNoComponents(): number {
        return this.noComponents;
    }
    
    public getComponent(i: number): string {
        this.checkRangeErrEqual(i);
        return this.parseComponents(this.name)[i];
    }
    
    public setComponent(i: number, c: string): Name {
        this.checkRangeAndTypeErrEqual(i, c);
        this.validateMasking(c);
        
        const components = this.parseComponents(this.name);
        components[i] = c;
        
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);
        
        this.assertClassInvariants();
        return result;
    }
    
    public insert(i: number, c: string): Name {
        this.checkRangeAndTypeErr(i, c);
        this.validateMasking(c);
        
        
        if (this.isTrulyEmpty) {
            return new StringName(c, this.delimiter);
        }
        
        const components = this.parseComponents(this.name);
        components.splice(i, 0, c);
        
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);
        
        this.assertClassInvariants();
        return result;
    }
    
    public append(c: string): Name {
        this.checkTypeErr(c);
        this.validateMasking(c);
        
       
        if (this.isTrulyEmpty) {
            return new StringName(c, this.delimiter);
        }
        
        const components = this.parseComponents(this.name);
        components.push(c);
        
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);
        
        this.assertClassInvariants();
        return result;
    }
    
    public remove(i: number): Name {
        this.checkRangeErrEqual(i);
        
        const components = this.parseComponents(this.name);
        components.splice(i, 1);
        
        
        if (components.length === 0) {
            return StringName.createEmpty(this.delimiter);
        }
        
        const newName = components.join(this.delimiter);
        const result = new StringName(newName, this.delimiter);
        
        this.assertClassInvariants();
        return result;
    }
}