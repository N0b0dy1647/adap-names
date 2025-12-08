import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Exception } from "../common/Exception"
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
        const baseName = this.getBaseName();
        
        InvalidStateException.assert(
            baseName !== null && baseName !== undefined,
            "Node base name is null or undefined"
        );
        InvalidStateException.assert(
            baseName.length > 0,
            "Node base name is empty"
        );
        
        const result: Name = this.parentNode.getFullName();
        result.append(baseName);
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
        IllegalArgumentException.assert(baseName != null, "base name cannot be null or undefined");
        IllegalArgumentException.assert(baseName.length > 0, "base name cannot be empty");
        IllegalArgumentException.assert(!baseName.includes("/"), "base name cannot contain directory separator '/'");
        IllegalArgumentException.assert(!baseName.includes("\0"), "base name cannot contain null byte");
    }

    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "Base name cannot be null or undefined"
        );

        const result = new Set<Node>();
        
        try {
            this.getFullName();
            const baseName = this.getBaseName();
            
            if (baseName === bn) {
                result.add(this);
            }
        } catch (ex) {
            throw new InvalidStateException("Failed to find11 nodes", ex as Exception);
        }
        
        return result;
    }
}