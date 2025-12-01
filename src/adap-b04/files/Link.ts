import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

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
        IllegalArgumentException.assert(bn.length > 0, "base Name must not be empty");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        
        IllegalArgumentException.assert(target !== null, "link has no target");
        IllegalArgumentException.assert(target !== undefined, "link has no target");
        return target as Node;
    }
}