import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "Delimiter cannot be null or undefined"
        );
        
        
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "Delimiter must be exactly one character"
        );
        
        this.delimiter = delimiter;
    }

    
    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.delimiter !== null && this.delimiter !== undefined && this.delimiter.length === 1,
            "Class invariant violated: delimiter is null, undefined, or invalid length"
        );
        
        const numComponents = this.getNoComponents();
        InvalidStateException.assert(
            numComponents >= 0,
            "Class invariant violated: number of components is negative"
        );
        
        
        for (let i = 0; i < numComponents; i++) {
            const component = this.getComponent(i);
            InvalidStateException.assert(
                component !== null && component !== undefined,
                `Class invariant violated: component at index ${i} is null or undefined`
            );
        }
    }

    
    protected validateMasking(component: string): void {
        IllegalArgumentException.assert(
            component !== null && component !== undefined,
            "Component cannot be null or undefined"
        );

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

    public asString(delimiter: string = this.delimiter): string {
        
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "Delimiter cannot be null or undefined"
        );
        
        
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "Delimiter must be exactly one character"
        );
        
        this.assertClassInvariants();
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        
        const unescaped = components.map(c => this.unescapeComponent(c));
        
        if (delimiter !== this.delimiter) {
            return unescaped.map(c => 
                c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                 .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter)
            ).join(delimiter);
        }
        
        const result = unescaped.join(delimiter);
        
        
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition violated: asString returned null or undefined"
        );
        
        this.assertClassInvariants();
        return result;
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
        this.assertClassInvariants();
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            components.push(
                c.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                 .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER)
            );
        }
        
        const result = components.join(DEFAULT_DELIMITER);
        
        
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition violated: asDataString returned null or undefined"
        );
        
        this.assertClassInvariants();
        return result;
    }

    public isEqual(other: Name): boolean {
        
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "Other name cannot be null or undefined"
        );
        
        this.assertClassInvariants();
        
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        this.assertClassInvariants();
        return true;
    }

    public getHashCode(): number {
        this.assertClassInvariants();
        
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash |= 0;
        }
        
        this.assertClassInvariants();
        return hash;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();
        
        const result = this.getNoComponents() === 0;
        
        this.assertClassInvariants();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        
        const result = this.delimiter;
        
        
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition violated: delimiter is null or undefined"
        );
        
        this.assertClassInvariants();
        return result;
    }

    public concat(other: Name): void {
        
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "Other name cannot be null or undefined"
        );
        
        this.assertClassInvariants();
        
        const oldSize = this.getNoComponents();
        const otherSize = other.getNoComponents();
        
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        
        
        MethodFailedException.assert(
            this.getNoComponents() === oldSize + otherSize,
            "Postcondition violated: concat did not increase size correctly"
        );
        
        this.assertClassInvariants();
    }

    protected checkRangeAndTypeErrEqual(i: number, c: string) {
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "Component cannot be null or undefined"
        );
        IllegalArgumentException.assert(
            i >= 0 && i < this.getNoComponents(),
            `Index ${i} out of bounds for Name with ${this.getNoComponents()} components`
        );
    }

    protected checkRangeAndTypeErr(i: number, c: string) {
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "Component cannot be null or undefined"
        );
        IllegalArgumentException.assert(
            i >= 0 && i <= this.getNoComponents(),
            `Index ${i} out of bounds for Name with ${this.getNoComponents()} components`
        );
    }

    protected checkRangeErrEqual(i: number) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.getNoComponents(),
            `Index ${i} out of bounds for Name with ${this.getNoComponents()} components`
        );
    }

    protected checkTypeErr(c: string) {
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "Component cannot be null or undefined"
        );
    }

    abstract clone(): Name;
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}