import { Node } from "./Node";
import { Directory } from "./Directory";
import { Name } from "../names/Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception"
import { InvalidStateException } from "../common/InvalidStateException";
export class Link extends Node {
    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);
        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(target !== null, "target must not be null");
        IllegalArgumentException.assert(target !== undefined, "target must not be undefined");
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(this.targetNode !== null, "link has no target");
        IllegalArgumentException.assert(this.targetNode !== undefined, "link has no target");
        IllegalArgumentException.assert(bn.length > 0, "base name must not be empty");
    
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(target !== null, "link has no target");
        IllegalArgumentException.assert(target !== undefined, "link has no target");
        return target as Node;
    }

    
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "Base name cannot be null or undefined"
        );

        
        const target = this.ensureTargetNode(this.targetNode);
        
        const result = new Set<Node>();
        
        
        if (this.getBaseName() === bn) {
            result.add(this);
        }
        
        
        const targetResults = target.findNodes(bn);
        for (const node of targetResults) {
            result.add(node);
        }
        
        return result;
    }
}