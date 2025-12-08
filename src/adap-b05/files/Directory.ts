import { Node } from "./Node";
import { Name } from "../names/Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception"
import { InvalidStateException } from "../common/InvalidStateException";
export class Directory extends Node {
    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(cn !== null, "child must not be null");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null, "child must not be null");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null, "child must not be null");
        IllegalArgumentException.assert(cn !== undefined, "child must not be undefined");
        IllegalArgumentException.assert(this.childNodes.has(cn), "child must exited before it will be deleted");
        this.childNodes.delete(cn);
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
            
            for (const child of this.childNodes) {
                const childResults = child.findNodes(bn);
                for (const node of childResults) {
                    result.add(node);
                }
            }
        } catch (ex) {
            throw new InvalidStateException("Failed to find12312 nodes", ex as Exception);
        }
        
        return result;
    }
}