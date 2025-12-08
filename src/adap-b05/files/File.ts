import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
}

export class File extends Node {
    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state !== FileState.OPEN, "file must not already be OPEN");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "file must not be DELETED");
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        
        this.checkMustBeOpen(this.state);
        IllegalArgumentException.assert(noBytes >= 0, "File must atleast 0 Byte contain");
        return new Int8Array(noBytes);
    }

    public close(): void {
        this.checkMustBeOpen(this.state);
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    private checkMustBeOpen(st: FileState): void {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be OPEN");
    }
}