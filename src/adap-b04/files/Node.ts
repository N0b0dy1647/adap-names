import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Node {
    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.validateConstructorArguments(bn);
        IllegalArgumentException.assert(pn != null, "parent node cannot be null or undefined");
        
        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to !== null, "target directory must not be null");
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== null, "base name must not be null");
        IllegalArgumentException.assert(bn !== undefined, "base name must be defined");
        IllegalArgumentException.assert(bn.length > 0, "base name must not be empty");
        IllegalArgumentException.assert(!bn.includes("/"), "base name cannot contain directory separator '/'");
        IllegalArgumentException.assert(!bn.includes("\0"), "base name cannot contain null byte");
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    protected validateConstructorArguments(baseName: string): void {
        IllegalArgumentException.assert(baseName !== null, "base name must not be null");
        IllegalArgumentException.assert(baseName !== undefined, "base name must be defined");
        IllegalArgumentException.assert(baseName.length > 0, "base name must not be empty");
        IllegalArgumentException.assert(!baseName.includes("/"), "base name cannot contain directory separator '/'");
        IllegalArgumentException.assert(!baseName.includes("\0"), "base name cannot contain null byte");
    }
}