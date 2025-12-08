import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception"
import { InvalidStateException } from "../common/InvalidStateException";
export class RootNode extends Directory {
    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation - root cannot be moved
    }

    protected doSetBaseName(bn: string): void {
        // null operation - root name is always empty
    }
    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== null, "base name must not be null");
        IllegalArgumentException.assert(bn !== undefined, "base name must be defined");
        IllegalArgumentException.assert(bn === "", "RootNode can only be renamed to empty string");
        // doSetBaseName() ist eine null-operation für RootNode
    }
    protected validateConstructorArguments(bn: string): void {
        const condition: boolean = (bn == "");
        IllegalArgumentException.assert(condition, "RootNode base name must be empty");
    }

    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "Base name cannot be null or undefined"
        );

        const result = new Set<Node>();
        
        try {
            if (this.getBaseName() === bn) {
                result.add(this);
            }
            
            for (const child of this.childNodes) {
                const childResults = child.findNodes(bn);
                for (const node of childResults) {
                    result.add(node);
                }
            }
        } catch (ex) {
            throw new ServiceFailureException("Failed to find nodes", ex as Exception);
        }
        
        return result;
    }
}