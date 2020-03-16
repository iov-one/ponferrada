import initStoryshots, { snapshotWithOptions } from "@storybook/addon-storyshots";
import ReactDOM from "react-dom";

ReactDOM.createPortal = jest.fn(element => {
  return element;
});

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: element => {
      return document.createElement("div");
    },
  }),
  framework: "react",
  storyKindRegex: /^((?!.*?Test disabled).)*$/,
});
