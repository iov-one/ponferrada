import MedulasThemeProvider from "medulas-react-components/lib/theme/MedulasThemeProvider";
import * as React from "react";
import { Provider } from "react-redux";

import { configureStore } from "../../store";
import { globalStyles } from "../../theme/globalStyles";

export const VOTER_ROOT = "Voter Dashboard";

const store = configureStore();

interface Props {
  readonly children: React.ReactNode;
}

const DecoratedStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        {children}
      </MedulasThemeProvider>
    </Provider>
  );
};

export default DecoratedStorybook;
