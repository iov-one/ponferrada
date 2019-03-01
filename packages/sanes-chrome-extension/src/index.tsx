import React from "react";
import ReactDOM from "react-dom";
import { Store } from "webext-redux";
import App from "./routes/home/container/App";

const store = new Store();

console.log(store);

const rootEl = document.getElementById("root");
console.log("rootEl" + rootEl);

try {
  const moe = store.ready().then(() => {
    console.log("Vamos que nos vamos");
  });
  console.log(moe);
} catch (err) {
  console.log("Hola");
  console.log(err);
}

console.log("Done!!!");
ReactDOM.render(<App />, rootEl);
console.log("Done 2!!!");

if (module.hot) {
  module.hot.accept("./routes", () => {
    const NextApp = require("./routes").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
