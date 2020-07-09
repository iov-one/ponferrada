import { MedulasThemeProvider } from "medulas-react-components";
import * as React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { DeepPartial } from "redux";

import { aNewStore } from "../../store";
import { RootState } from "../../store/reducers";
import { globalStyles } from "../../theme/globalStyles";

export const bierzoRoot = "Bierzo Wallet";

interface Props {
  readonly children: React.ReactNode;
  readonly storeProps?: DeepPartial<RootState>;
}

const DecoratedStorybook = ({ children, storeProps }: Props): JSX.Element => {
  return (
    <Provider store={aNewStore(storeProps)}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <MemoryRouter>{children}</MemoryRouter>
      </MedulasThemeProvider>
    </Provider>
  );
};

export default DecoratedStorybook;
