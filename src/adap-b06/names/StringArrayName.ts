import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
    private readonly components: readonly string[];
    
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
        
        
        this.components = Object.freeze([...source]);
        
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
    
    public setComponent(i: number, c: string): Name {
        this.checkRangeAndTypeErrEqual(i, c);
        this.validateComponentMasking(c);
        
        const newComponents = [...this.components];
        newComponents[i] = c;
        
        const result = new StringArrayName(newComponents, this.delimiter);
        this.assertClassInvariants();
        return result;
    }
    
    public insert(i: number, c: string): Name {
        this.checkRangeAndTypeErr(i, c);
        this.validateComponentMasking(c);
        
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        
        const result = new StringArrayName(newComponents, this.delimiter);
        this.assertClassInvariants();
        return result;
    }
    
    public append(c: string): Name {
        this.checkTypeErr(c);
        this.validateComponentMasking(c);
        
        const newComponents = [...this.components, c];
        
        const result = new StringArrayName(newComponents, this.delimiter);
        this.assertClassInvariants();
        return result;
    }
    
    public remove(i: number): Name {
        this.checkRangeErrEqual(i);
        
        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        
        const result = new StringArrayName(newComponents, this.delimiter);
        this.assertClassInvariants();
        return result;
    }
    
    public asDataString(): string {
        this.assertClassInvariants();
        
        const result = this.components.join(DEFAULT_DELIMITER);
        
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition violated: asDataString returned null or undefined"
        );
        
        this.assertClassInvariants();
        return result;
    }
}