import { ConnectedRouter } from 'connected-react-router';
import { mount, ReactWrapper } from 'enzyme';
import { createMemoryHistory } from 'history';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../../store';
import { createRootReducer } from '../../store/reducers';
import { globalStyles } from '../../theme/globalStyles';
import { Welcome } from '../welcome';

describe('The welcome route', () => {
  let fakeHistory, fakeReducer, fakeStore, wrapper: ReactWrapper, button: ReactWrapper;

  beforeEach(() => {
    fakeHistory = createMemoryHistory();
    fakeReducer = createRootReducer(fakeHistory);
    fakeStore = configureStore(fakeReducer, fakeHistory);

    wrapper = mount(
      <Provider store={fakeStore}>
        <ConnectedRouter history={fakeHistory}>
          <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
            <Welcome />
          </MedulasThemeProvider>
        </ConnectedRouter>
      </Provider>
    );

    button = wrapper.find('button');
  });

  describe('has a button that', () => {
    it('exists', () => {
      expect(button.exists()).toBeTruthy();
    });

    it('redirects to the payment route when clicked', () => {
      button.simulate('click');
      expect(window.location.href).toContain('payment');
    });
  });
});
