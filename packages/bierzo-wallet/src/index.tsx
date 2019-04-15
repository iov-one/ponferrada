import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { globalStyles } from './theme/globalStyles';

const rootEl = document.getElementById('root');

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
      <Component />
    </MedulasThemeProvider>,
    rootEl
  );
};

render(App);

if (module.hot) {
  module.hot.accept(
    './App',
    (): void => {
      const NextApp = require('./App').default;
      render(NextApp);
    }
  );
}
