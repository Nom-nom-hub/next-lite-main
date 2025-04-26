declare module 'ws' {
  import { EventEmitter } from 'events';
  import { IncomingMessage } from 'http';
  import { Duplex } from 'stream';

  class WebSocket extends EventEmitter {
    static Server: typeof Server;
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
    
    constructor(address: string, protocols?: string | string[], options?: any);
    
    readyState: number;
    protocol: string;
    
    close(code?: number, reason?: string): void;
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    send(data: any, cb?: (err?: Error) => void): void;
    send(data: any, options: { mask?: boolean; binary?: boolean }, cb?: (err?: Error) => void): void;
    
    on(event: 'close', listener: (code: number, reason: string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'message', listener: (data: WebSocket.Data) => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  namespace WebSocket {
    type Data = string | Buffer | ArrayBuffer | Buffer[];
    
    interface ClientOptions {
      protocol?: string;
      perMessageDeflate?: boolean | object;
      handshakeTimeout?: number;
      maxPayload?: number;
    }
    
    class Server extends EventEmitter {
      constructor(options: { port?: number; host?: string; path?: string; server?: any }, callback?: () => void);
      
      clients: Set<WebSocket>;
      
      close(cb?: (err?: Error) => void): void;
      
      on(event: 'connection', cb: (socket: WebSocket, request: IncomingMessage) => void): this;
      on(event: 'error', cb: (error: Error) => void): this;
      on(event: 'headers', cb: (headers: string[], request: IncomingMessage) => void): this;
      on(event: 'listening', cb: () => void): this;
      on(event: string | symbol, listener: (...args: any[]) => void): this;
    }
  }
  
  export = WebSocket;
}
