import { BillboardProvider, MedulasThemeProvider, ToastProvider } from "medulas-react-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Routes from "./routes";
import { configureStore } from "./store";
import { globalStyles } from "./theme/globalStyles";

const store = configureStore();
const rootEl = document.getElementById("root");

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <ToastProvider>
          <BillboardProvider>
            <Component />
          </BillboardProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
    rootEl,
  );
};

render(Routes);

if (module.hot) {
  module.hot.accept("./routes", (): void => {
    const NextApp = require("./routes").default;
    render(NextApp);
  });
}
