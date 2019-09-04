import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Storybook } from "../../utils/storybook";
import PageColumn from "./index";

const RenderHeader = (): JSX.Element => <React.Fragment />;

storiesOf("Components/PageColumn", module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("default", () => (
    <Storybook>
      <PageColumn
        icon="white"
        primaryTitle="Page"
        secondaryTitle="column"
        subtitle="Storybook PageColumn component example."
        renderHeader={RenderHeader}
        primaryNextLabel="Continue"
        primaryNextClicked={action("Page form submit")}
      />
    </Storybook>
  ))
  .add("with secondary next button", () => (
    <Storybook>
      <PageColumn
        icon="white"
        primaryTitle="Page"
        secondaryTitle="column"
        subtitle="Storybook PageColumn component example."
        renderHeader={RenderHeader}
        primaryNextLabel="Continue"
        primaryNextClicked={action("Page form submit")}
        secondaryNextLabel="Password forgotten"
        secondaryNextClicked={action("Password forgotten clicked")}
      />
    </Storybook>
  ));
