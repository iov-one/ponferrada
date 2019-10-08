import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import PageColumn from "./index";

storiesOf(`${medulasRoot}/pages`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("PageColumn", () => (
    <Storybook>
      <PageColumn
        onLoginWithNeuma={action("onLoginWithNeuma")}
        onLoginWithLedger={action("onLoginWithLedger")}
        onGetNeumaExtension={action("onGetNeumaExtension")}
      />
    </Storybook>
  ));
