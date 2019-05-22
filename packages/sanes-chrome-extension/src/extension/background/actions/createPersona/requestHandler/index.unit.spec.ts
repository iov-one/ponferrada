import { Request, RequestHandler } from './index';

describe('RequestHandler', () => {
  const REQUEST_ONE: Request = {
    id: 1999,
    type: 'getIdentities',
    reason: 'Reason 1',
    sender: 'Sender 1',
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_TWO: Request = {
    id: 2999,
    type: 'signAndPost',
    reason: 'Reason 2',
    sender: 'Sender 2',
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_THREE: Request = {
    id: 3999,
    type: 'getIdentities',
    reason: 'Reason 3',
    sender: 'Sender 3',
    accept: jest.fn(),
    reject: jest.fn(),
  };

  beforeEach(() => {
    RequestHandler.load();
    RequestHandler.add(REQUEST_ONE);
    RequestHandler.add(REQUEST_TWO);
    RequestHandler.add(REQUEST_THREE);
  });

  it('re-initializes itself', () => {
    RequestHandler.load();

    expect(RequestHandler['instance'].length).toBe(0);
    expect(RequestHandler['counter']).toBe(0);
  });

  it('updates counter when a new request is added', () => {
    expect(RequestHandler['counter']).toBe(3);
    RequestHandler.solved();
    expect(RequestHandler['counter']).toBe(3);
    RequestHandler.add(REQUEST_ONE);
    expect(RequestHandler['counter']).toBe(4);
  });

  it('returns all the requests', () => {
    let requests = RequestHandler.requests();

    expect(requests.length).toBe(3);
    expect(requests[0].reason).toBe(REQUEST_ONE.reason);
    expect(requests[1].reason).toBe(REQUEST_TWO.reason);
    expect(requests[2].reason).toBe(REQUEST_THREE.reason);

    RequestHandler.solved();
    RequestHandler.solved();
    requests = RequestHandler.requests();

    expect(requests.length).toBe(1);
    expect(requests[0].reason).toBe(REQUEST_THREE.reason);

    RequestHandler.solved();
    requests = RequestHandler.requests();

    expect(requests.length).toBe(0);
  });

  it('returns the next request', () => {
    expect(RequestHandler.next().reason).toBe(REQUEST_ONE.reason);
  });

  it('solves requests in an orderly fashion', () => {
    expect(RequestHandler.next().reason).toBe(REQUEST_ONE.reason);
    RequestHandler.solved();
    expect(RequestHandler.next().reason).toBe(REQUEST_TWO.reason);
    RequestHandler.solved();
    expect(RequestHandler.next().reason).toBe(REQUEST_THREE.reason);
  });

  it('assigns new id based on counter to new added requests', () => {
    let requests = RequestHandler.requests();

    expect(requests[0].id).toBe(0);
    expect(requests[1].id).toBe(1);
    expect(requests[2].id).toBe(2);

    RequestHandler.solved();
    RequestHandler.solved();
    RequestHandler.solved();

    RequestHandler.add(REQUEST_ONE);
    expect(RequestHandler.next().id).toBe(3);
  });
});
