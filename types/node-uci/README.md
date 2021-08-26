# Installation
> `npm install --save @types/node-uci`

# Summary
This package contains type definitions for node-uci (https://github.com/ebemunk/node-uci).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node-uci.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node-uci/index.d.ts)
````ts
// Type definitions for node-uci 1.3
// Project: https://github.com/ebemunk/node-uci
// Definitions by: Weslen Nascimento <https://github.com/weslenng>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Minimum TypeScript Version: 3.0
/// <reference types="node" />

import { EventEmitter } from 'events';

export interface SearchOptions {
    searchmoves?: ReadonlyArray<string> | undefined;
    ponder?: boolean | undefined;
    wtime?: number | undefined;
    btime?: number | undefined;
    winc?: number | undefined;
    binc?: number | undefined;
    movestogo?: number | undefined;
    depth?: number | undefined;
    nodes?: number | undefined;
    mate?: number | undefined;
    movetime?: number | undefined;
}

export interface SearchResult {
    bestmove: string;
    info: ReadonlyArray<string>;
}

export class Engine {
    constructor(enginePath: string);
    getBufferUntil(fn: (str: string) => boolean): Promise<ReadonlyArray<string>>;
    write(cmd: string): void;
    chain(): EngineChain;
    init(): Promise<Engine>;
    quit(): Promise<Engine>;
    isready(): Promise<Engine>;
    sendCmd(cmd: string): Promise<Engine>;
    setoption(name: string, value?: string): Promise<Engine>;
    ucinewgame(): Promise<Engine>;
    ponderhit(): Promise<Engine>;
    position(fen: string, moves?: ReadonlyArray<string>): Promise<Engine>;
    go(sp: SearchOptions): Promise<SearchResult>;
    goInfinite(sp: SearchOptions): EventEmitter;
    stop(): Promise<SearchResult>;
}

export class EngineChain {
    constructor(engine: Engine);
    init(): EngineChain;
    setoption(name: string, value?: string): EngineChain;
    isready(): EngineChain;
    ucinewgame(): EngineChain;
    quit(): EngineChain;
    position(fen: string, moves?: ReadonlyArray<string>): EngineChain;
    go(sp: SearchOptions): Promise<SearchResult>;
    exec(): unknown;
}

````

### Additional Details
 * Last updated: Thu, 08 Jul 2021 18:51:28 GMT
 * Dependencies: [@types/node](https://npmjs.com/package/@types/node)
 * Global values: none

# Credits
These definitions were written by [Weslen Nascimento](https://github.com/weslenng).
