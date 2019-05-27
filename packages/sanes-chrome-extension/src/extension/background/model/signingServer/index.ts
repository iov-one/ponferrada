import { Address, PublicIdentity, UnsignedTransaction } from '@iov/bcp';
import { ChainNames } from '../persona/config';
import { requestCallback } from './requestCallback';
import {
  GetIdentitiesRequest,
  isRequestMeta,
  Request,
  RequestHandler,
  SignAndPostRequest,
} from './requestHandler';
import { SenderWhitelist } from './senderWhitelist';

export class SigningServer {
  private requestHandler = new RequestHandler();
  private senderWhitelist = new SenderWhitelist();

  public getIdentitiesCallback = (
    chainNames: ChainNames,
    addressMapper: (id: PublicIdentity) => Address,
  ) => async (
    reason: string,
    matchingIdentities: ReadonlyArray<PublicIdentity>,
    meta: any, // eslint-disable-line
  ) => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }
    const { senderUrl } = meta;

    const requestedIdentities = matchingIdentities.map(matchedIdentity => {
      const chainName = chainNames[matchedIdentity.chainId];

      return {
        name: chainName,
        address: addressMapper(matchedIdentity),
      };
    });

    const data: GetIdentitiesRequest = {
      senderUrl,
      requestedIdentities,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'getIdentities',
      data,
      matchingIdentities,
      [],
    );
  };

  public signAndPostCallback = () => (
    reason: string,
    transaction: UnsignedTransaction,
    meta: any, // eslint-disable-line
  ): Promise<boolean> => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }
    const { senderUrl } = meta;

    const data: SignAndPostRequest = {
      senderUrl,
      tx: transaction,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'signAndPost',
      data,
      true,
      false,
    );
  };

  public getPendingRequests(): Request[] {
    return this.requestHandler.requests();
  }
}
