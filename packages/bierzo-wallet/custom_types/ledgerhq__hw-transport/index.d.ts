declare module "@ledgerhq/hw-transport" {
  // See https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-transport/src/Transport.js
  class Transport {
    static create(openTimeout?: number, listenTimeout?: number): Promise<Transport>;

    close(): Promise<void>;
    decorateAppAPIMethods(self: any, methods: string[], scrambleKey: string): void;
    send(
      cla: number,
      ins: number,
      p1: number,
      p2: number,
      data?: Buffer,
      statusList?: number[],
    ): Promise<Buffer>;
  }

  export default Transport;
}
