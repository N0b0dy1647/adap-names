import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
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
        // null operation
    }
    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== null, "base name must not be null");
        IllegalArgumentException.assert(bn !== undefined, "base name must be defined");
        IllegalArgumentException.assert(bn === "", "RootNode can only be renamed to empty string");
        // doSetBaseName() ist eine null-operation für RootNode
    }
    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected validateConstructorArguments(bn: string): void {
        IllegalArgumentException.assert(bn != null, "base name cannot be null or undefined");
        IllegalArgumentException.assert(!(bn.length > 0), "bases name cannot be empty");
        IllegalArgumentException.assert(!bn.includes("/"), "base name cannot contain directory separator '/'");
        IllegalArgumentException.assert(!bn.includes("\0"), "base name cannot contain null byte");
    }

}