// Type definitions for node-uci 1.3
// Project: https://github.com/ebemunk/node-uci
// Definitions by: Weslen Nascimento <https://github.com/weslenng>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Minimum TypeScript Version: 3.0
/// <reference types="node" />

declare module 'node-uci' {
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

  export type EngineOptions = Map<
    string,
    {
      type: 'check' | 'spin' | 'combo' | 'string' | 'button';
      default: boolean | number | string;
      min?: number;
      max?: number;
      options?: [string];
    }
  >;

  export class Engine {
    constructor(enginePath: string);
    getBufferUntil(
      fn: (str: string) => boolean
    ): Promise<ReadonlyArray<string>>;
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
    id: { name: string; author: string };
    filePath: string;
    options: EngineOptions;
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
}
