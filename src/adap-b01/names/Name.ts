import { join } from "path";

export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // @methodtype Initialization Method 
    constructor(other: string[], delimiter?: string) {
        this.delimiter = delimiter ?? this.delimiter;
        this.components= [...other];
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        //throw new Error("needs implementation or deletion");
        const unmaskComponets = this.components.map(comp => this.asUnmask(comp));
        return unmaskComponets.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        if (this.delimiter === DEFAULT_DELIMITER){
            return this.components.join(DEFAULT_DELIMITER);
        }
        const remappedComponents = this.components.map(comp => {
            const unmasked = this.asUnmask(comp);
            return this.asMask(unmasked, DEFAULT_DELIMITER );

        });
        return remappedComponents.join(DEFAULT_DELIMITER);
        //throw new Error("needs implementation or deletion");
    }

    /** Returns properly masked component string */
    // @methodetype get-methode
    public getComponent(i: number): string {
        //throw new Error("needs implementation or deletion");
        this.indexBouncerDetector(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodetype set-methode
    public setComponent(i: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        this.indexBouncerDetector(i);
        this.components[i]= c;
    }

     /** Returns number of components in Name instance */
     // @methodetype get-methode
     public getNoComponents(): number {
        //throw new Error("needs implementation or deletion");
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        //throw new Error("needs implementation or deletion");
        if(i < 0 || i > this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);   
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        //throw new Error("needs implementation or deletion");
        this.components.push(c);
    }
    // @methodtype command-method
    public remove(i: number): void {
        //throw new Error("needs implementation or deletion");
        this.indexBouncerDetector(i);
        this.components.splice(i,1);
    }
//====== Privat Helper Functions ======//
    // @methodetype Helper-methode/conversion-method
    private asUnmask(component: string): string{
        let res = '';
        
        for(let i = 0; i<component.length; i++){
            if(component[i] === ESCAPE_CHARACTER && i+1 < component.length){
                res+=component[i+1];
                i++
            }else{
                res+=component[i];
            }
        }
        return res;
    }
    // @methodetype Helper-methode/conversion-method
    private asMask(str: string, delimiter: string): string{
        let res= '';

        for (const char of str){
            if(char === delimiter || char === ESCAPE_CHARACTER){
                res += ESCAPE_CHARACTER + char;
            }else{
                res += char;
            }
        }
        return res;
    }

    // @methodetype Assertion Method
    protected indexBouncerDetector(i: number): void{
        if(i < 0 || i >= this.components.length){
            throw new RangeError(`Index ${i} out of bounds for Name with ${this.components.length} components`);   
        }
    }

}
