import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";
import Route from "./routes";
import { history } from "./store/reducers";

const store = new Store();

const rootEl = document.getElementById("root");

const Root = (): JSX.Element => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route />
    </ConnectedRouter>
  </Provider>
);

store.ready().then(() => {
  ReactDOM.render(<Root />, rootEl);
});

if (module.hot) {
  module.hot.accept("./routes", () => {
    const NextApp = require("./routes").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
