import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];
    
    constructor(source: string[], delimiter?: string) {
        
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "Source array cannot be null or undefined"
        );
        
        
        if (delimiter !== undefined) {
            IllegalArgumentException.assert(
                delimiter !== null && delimiter.length === 1,
                "Delimiter must be exactly one character"
            );
        }
        
        super(delimiter);
        
        
        this.components = [...source];
        
        
        for (let i = 0; i < this.components.length; i++) {
            IllegalArgumentException.assert(
                this.components[i] !== null && this.components[i] !== undefined,
                `Component at index ${i} cannot be null or undefined`
            );
            
            
            this.validateComponentMasking(this.components[i]);
        }
        
        
        this.assertClassInvariants();
    }
    
  
    private validateComponentMasking(component: string): void {
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER) {
                
                IllegalArgumentException.assert(
                    i + 1 < component.length,
                    "Component contains dangling escape character"
                );
                i += 2; 
            } else {
                
                IllegalArgumentException.assert(
                    component[i] !== this.delimiter,
                    "Component contains unmasked delimiter"
                );
                i++;
            }
        }
    }
    
    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }
    
    public getNoComponents(): number {
        return this.components.length;
    }
    
    public getComponent(i: number): string {
        this.checkRangeErrEqual(i);
        return this.components[i];
    }
    
    public setComponent(i: number, c: string): void {
        this.checkRangeAndTypeErrEqual(i, c);
        
        
        this.validateComponentMasking(c);
        
        this.components[i] = c;
        
        
        this.assertClassInvariants();
    }
    
    public insert(i: number, c: string): void {
        this.checkRangeAndTypeErr(i, c);
        
        
        this.validateComponentMasking(c);
        
        this.components.splice(i, 0, c);
        
        
        this.assertClassInvariants();
    }
    
    public append(c: string): void {
        this.checkTypeErr(c);
        
        
        this.validateComponentMasking(c);
        
        this.components.push(c);
        
        
        this.assertClassInvariants();
    }
    
    public remove(i: number): void {
        this.checkRangeErrEqual(i);
        this.components.splice(i, 1);
        
        
        this.assertClassInvariants();
    }
    
    
    public asDataString(): string {
        this.assertClassInvariants();
        
        
        const result = this.components.join(DEFAULT_DELIMITER);
        
        
        if (result === null || result === undefined) {
            throw new Error("Postcondition violated: asDataString returned null or undefined");
        }
        
        this.assertClassInvariants();
        return result;
    }
}