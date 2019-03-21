import { Store } from 'redux';
import { RootState } from '../../reducers';
import { testStore } from '../../../store';
import { setUsername } from '../actions';

describe('profile actions', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = testStore();
  });

  it('should set username', async () => {
    // ensure store is empty
    const init = store.getState();
    expect(init.user.username).toBeUndefined();
    expect(init.user.username).toBeUndefined();

    // ensure the action is correct
    const createUser = setUsername('test-user');
    expect(createUser.type).toEqual('SET_USERNAME');
    expect(createUser.username).toEqual('test-user');

    // dispatch action
    store.dispatch(createUser);

    // make sure the username is set properly in store
    const after = store.getState();
    const storeUsername = after.user.username;
    expect(storeUsername).not.toBeUndefined();
    expect(storeUsername).toEqual(createUser.username);
  });
});
