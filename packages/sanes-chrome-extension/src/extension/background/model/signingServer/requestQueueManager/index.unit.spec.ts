import { Omit } from '@material-ui/core';
import { Request, RequestQueueManager } from './index';

describe('RequestHandler', () => {
  const REQUEST_ONE: Omit<Request, 'id'> = {
    type: 'getIdentities',
    reason: 'Reason 1',
    data: {
      senderUrl: 'Sender 1',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_TWO: Omit<Request, 'id'> = {
    type: 'signAndPost',
    reason: 'Reason 2',
    data: {
      senderUrl: 'Sender 2',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_THREE: Omit<Request, 'id'> = {
    type: 'getIdentities',
    reason: 'Reason 3',
    data: {
      senderUrl: 'Sender 3',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  let requestQueueManager: RequestQueueManager;
  beforeEach(() => {
    requestQueueManager = new RequestQueueManager();
    requestQueueManager.add(REQUEST_ONE);
    requestQueueManager.add(REQUEST_TWO);
    requestQueueManager.add(REQUEST_THREE);
  });

  it('updates counter when a new request is added', () => {
    // RequestHandler does not expose its internal counter, so this is an exceptional use case
    // which can not be used in regular code because it violates private modifier of blocked variable.
    expect(requestQueueManager['counter']).toBe(3);
    requestQueueManager.solved();
    expect(requestQueueManager['counter']).toBe(3);
    requestQueueManager.add(REQUEST_ONE);
    expect(requestQueueManager['counter']).toBe(4);
  });

  it('returns all the requests', () => {
    let requests = requestQueueManager.requests();

    expect(requests.length).toBe(3);
    expect(requests[0].reason).toBe(REQUEST_ONE.reason);
    expect(requests[1].reason).toBe(REQUEST_TWO.reason);
    expect(requests[2].reason).toBe(REQUEST_THREE.reason);

    requestQueueManager.solved();
    requestQueueManager.solved();
    requests = requestQueueManager.requests();

    expect(requests.length).toBe(1);
    expect(requests[0].reason).toBe(REQUEST_THREE.reason);

    requestQueueManager.solved();
    requests = requestQueueManager.requests();

    expect(requests.length).toBe(0);
  });

  it('returns the next request', () => {
    expect(requestQueueManager.next().reason).toBe(REQUEST_ONE.reason);
  });

  it('solves requests in an orderly fashion', () => {
    expect(requestQueueManager.next().reason).toBe(REQUEST_ONE.reason);
    requestQueueManager.solved();
    expect(requestQueueManager.next().reason).toBe(REQUEST_TWO.reason);
    requestQueueManager.solved();
    expect(requestQueueManager.next().reason).toBe(REQUEST_THREE.reason);
  });

  it('assigns new id based on counter to new added requests', () => {
    let requests = requestQueueManager.requests();

    expect(requests[0].id).toBe(0);
    expect(requests[1].id).toBe(1);
    expect(requests[2].id).toBe(2);

    requestQueueManager.solved();
    requestQueueManager.solved();
    requestQueueManager.solved();

    requestQueueManager.add(REQUEST_ONE);
    expect(requestQueueManager.next().id).toBe(3);
  });
});
